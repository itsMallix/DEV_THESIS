const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Staking Contract", function () {
  let staking;
  let stakingToken;
  let rewardToken;
  let owner;
  let addr1;
  let addr2;
  let timeUnit = 86400; // 1 day dalam detik
  let rewardRatioNum = 10;
  let rewardRatioDenom = 100;

  beforeEach(async function () {
    // deklaraisi variabel addr
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // deploy erc20 mock token testing
    const ERC20 = await ethers.getContractFactory("MockERC20");
    stakingToken = await ERC20.deploy(
      "Staking Token",
      "STK",
      ethers.parseEther("1000000")
    );
    rewardToken = await ERC20.deploy(
      "Reward Token",
      "RWD",
      ethers.parseEther("1000000")
    );
    await stakingToken.waitForDeployment();
    await rewardToken.waitForDeployment();

    const stakingTokenAddress = await stakingToken.getAddress();
    const rewardTokenAddress = await rewardToken.getAddress();

    // deploy staking
    const StakingContract = await ethers.getContractFactory("Staking");
    staking = await StakingContract.deploy(
      rewardTokenAddress,
      stakingTokenAddress,
      timeUnit,
      rewardRatioNum,
      rewardRatioDenom
    );
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();

    // transfer token untuk tes akun ke adr1 dan addr2
    await stakingToken.transfer(addr1.address, ethers.parseEther("10000"));
    await stakingToken.transfer(addr2.address, ethers.parseEther("10000"));

    // approve dulu le
    await stakingToken
      .connect(addr1)
      .approve(stakingAddress, ethers.parseEther("10000"));
    await stakingToken
      .connect(addr2)
      .approve(stakingAddress, ethers.parseEther("10000"));

    // deposit reward token ke sc
    await rewardToken.approve(stakingAddress, ethers.parseEther("100000"));
    await rewardToken.transfer(stakingAddress, ethers.parseEther("100000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await staking.admin()).to.equal(owner.address);
    });

    it("Should set the correct token addresses", async function () {
      const stakingTokenAddress = await stakingToken.getAddress();
      const rewardTokenAddress = await rewardToken.getAddress();

      expect(await staking.rewardToken()).to.equal(rewardTokenAddress);
      expect(await staking.stakingToken()).to.equal(stakingTokenAddress);
    });

    it("Should set the correct reward parameters", async function () {
      expect(await staking.timeUnit()).to.equal(timeUnit);
      expect(await staking.rewardRatioNumerator()).to.equal(rewardRatioNum);
      expect(await staking.rewardRatioDenominator()).to.equal(rewardRatioDenom);
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      const stakeAmount = ethers.parseEther("1000");

      await expect(staking.connect(addr1).stake(stakeAmount))
        .to.emit(staking, "Staked")
        .withArgs(addr1.address, stakeAmount);

      expect(await staking.stakedBalances(addr1.address)).to.equal(stakeAmount);
      expect(await staking.stakingTokenBalance()).to.equal(stakeAmount);
    });

    it("Should not allow staking 0 tokens", async function () {
      await expect(staking.connect(addr1).stake(0)).to.be.revertedWith(
        "Cannot stake 0"
      );
    });

    it("Should update staking timestamp on stake", async function () {
      const currentTimestamp = await time.latest();
      await staking.connect(addr1).stake(ethers.parseEther("1000"));

      const stakingTimestamp = await staking.stakingTimestamps(addr1.address);
      expect(stakingTimestamp).to.be.at.least(currentTimestamp);
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      // Stake some tokens first
      await staking.connect(addr1).stake(ethers.parseEther("1000"));
    });

    it("Should allow users to unstake tokens", async function () {
      const unstakeAmount = ethers.parseEther("500");

      await expect(staking.connect(addr1).unstake(unstakeAmount))
        .to.emit(staking, "Unstaked")
        .withArgs(addr1.address, unstakeAmount);

      expect(await staking.stakedBalances(addr1.address)).to.equal(
        ethers.parseEther("500")
      );
      expect(await staking.stakingTokenBalance()).to.equal(
        ethers.parseEther("500")
      );
    });

    it("Should not allow unstaking more than staked amount", async function () {
      const excessAmount = ethers.parseEther("1500");
      await expect(
        staking.connect(addr1).unstake(excessAmount)
      ).to.be.revertedWith("Insufficient staked balance");
    });

    it("Should not allow unstaking if nothing is staked", async function () {
      await expect(
        staking.connect(addr2).unstake(ethers.parseEther("100"))
      ).to.be.revertedWith("Insufficient staked balance");
    });
  });

  describe("Rewards", function () {
    beforeEach(async function () {
      // Stake tokens and move time forward
      await staking.connect(addr1).stake(ethers.parseEther("1000"));

      // Deposit reward tokens to the contract
      await staking
        .connect(owner)
        .depositRewardTokens(ethers.parseEther("10000"));
    });

    it("Should calculate rewards correctly", async function () {
      // Advance time by 2 days
      await time.increase(2 * timeUnit);

      // Calculate expected reward: (staked_amount * duration * ratio_num) / (time_unit * ratio_denom)
      // (1000 * 2 * 10) / (1 * 100) = 200 tokens
      const [_, calculatedReward] = await staking.getStakeInfo(addr1.address);

      // Allow for small differences due to block timestamp variations
      expect(calculatedReward).to.be.at.least(ethers.parseEther("199"));
      expect(calculatedReward).to.be.at.most(ethers.parseEther("201"));
    });

    // Update just the failing test within the Rewards section:

    it("Should allow users to claim rewards", async function () {
      // Advance time by 2 days
      await time.increase(2 * timeUnit);

      // Get calculated reward before claiming
      const [_, calculatedReward] = await staking.getStakeInfo(addr1.address);

      // Get reward token balance before claiming
      const balanceBefore = await staking.rewardTokenBalance();

      // Claim rewards
      await staking.connect(addr1).claimRewards();

      // Get reward token balance after claiming
      const balanceAfter = await staking.rewardTokenBalance();

      // The difference should be approximately equal to the calculated reward
      const actualDifference = balanceBefore - balanceAfter;

      // Check if the difference is very close to the calculated reward (within 0.1%)
      const differencePct =
        Math.abs(Number(actualDifference - calculatedReward)) /
        Number(calculatedReward);
      expect(differencePct).to.be.lessThan(
        0.001,
        "Balance difference should match calculated reward"
      );
    });

    it("Should reset staking timestamp after claiming rewards", async function () {
      await time.increase(timeUnit);
      const beforeTimestamp = await staking.stakingTimestamps(addr1.address);

      await staking.connect(addr1).claimRewards();

      const afterTimestamp = await staking.stakingTimestamps(addr1.address);
      expect(afterTimestamp).to.be.gt(beforeTimestamp);
    });

    it("Should not allow claiming rewards with zero staked balance", async function () {
      await expect(staking.connect(addr2).claimRewards()).to.be.revertedWith(
        "No staked tokens"
      );
    });

    it("Should not allow claiming rewards if contract has insufficient reward tokens", async function () {
      // First withdraw all reward tokens
      await staking
        .connect(owner)
        .withdrawRewardTokens(ethers.parseEther("10000"));

      // Advance time to accumulate rewards
      await time.increase(timeUnit);

      // Try to claim rewards
      await expect(staking.connect(addr1).claimRewards()).to.be.revertedWith(
        "Not enough rewards"
      );
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to deposit reward tokens", async function () {
      const depositAmount = ethers.parseEther("5000");

      await expect(staking.connect(owner).depositRewardTokens(depositAmount))
        .to.emit(staking, "RewardDeposited")
        .withArgs(depositAmount);

      expect(await staking.rewardTokenBalance()).to.equal(depositAmount);
    });

    it("Should not allow non-admin to deposit reward tokens", async function () {
      await expect(
        staking.connect(addr1).depositRewardTokens(ethers.parseEther("1000"))
      ).to.be.revertedWith("Not authorized");
    });

    it("Should allow admin to withdraw reward tokens", async function () {
      // First deposit some tokens
      await staking
        .connect(owner)
        .depositRewardTokens(ethers.parseEther("5000"));

      // Then withdraw some
      const withdrawAmount = ethers.parseEther("2000");

      await expect(staking.connect(owner).withdrawRewardTokens(withdrawAmount))
        .to.emit(staking, "RewardWithdrawn")
        .withArgs(withdrawAmount);

      expect(await staking.rewardTokenBalance()).to.equal(
        ethers.parseEther("3000")
      );
    });

    it("Should not allow withdrawing more than available rewards", async function () {
      await staking
        .connect(owner)
        .depositRewardTokens(ethers.parseEther("1000"));

      await expect(
        staking.connect(owner).withdrawRewardTokens(ethers.parseEther("2000"))
      ).to.be.revertedWith("Not enough reward tokens");
    });
  });

  describe("View Functions", function () {
    it("Should return correct staking information", async function () {
      // Stake tokens
      await staking.connect(addr1).stake(ethers.parseEther("1000"));

      // Advance time
      await time.increase(timeUnit);

      // Get staking info
      const [stakedAmount, reward] = await staking.getStakeInfo(addr1.address);

      expect(stakedAmount).to.equal(ethers.parseEther("1000"));

      // Expected reward: (1000 * 1 * 10) / (1 * 100) = 100 tokens
      expect(reward).to.be.at.least(ethers.parseEther("99"));
      expect(reward).to.be.at.most(ethers.parseEther("101"));
    });
  });
});
