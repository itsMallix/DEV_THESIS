const { expect } = require("chai");
const { ethers } = require("ethers");
const { ethers: hardhatEthers } = require("hardhat");

//ambil sc reward token
describe("RewardToken", function () {
  let RewardToken, rewardToken, owner, addr1, addr2;

  beforeEach(async function () {
    RewardToken = await hardhatEthers.getContractFactory("RewardToken");
    [owner, addr1, addr2] = await hardhatEthers.getSigners();

    rewardToken = await RewardToken.deploy();
    await rewardToken.waitForDeployment();
  });

  //kondisi 1 sc harus bisa deploy
  it("Should deploy with correct total supply", async function () {
    const totalSupply = await rewardToken.totalSupply();
    expect(await rewardToken.balanceOf(owner.address)).to.equal(totalSupply);
  });

  it("Should allow transfer of tokens between accounts", async function () {
    const transferAmount = ethers.parseEther("1000");

    await rewardToken.transfer(addr1.address, transferAmount);
    expect(await rewardToken.balanceOf(addr1.address)).to.equal(transferAmount);
    expect(await rewardToken.balanceOf(owner.address)).to.equal(
      (await rewardToken.totalSupply()) - transferAmount
    );
  });

  it("Should emit Transfer event on successful transfer", async function () {
    const transferAmount = ethers.parseEther("500");
    await expect(rewardToken.transfer(addr1.address, transferAmount))
      .to.emit(rewardToken, "Transfer")
      .withArgs(owner.address, addr1.address, transferAmount);
  });

  it("Should fail if sender does not have enough balance", async function () {
    const transferAmount = ethers.parseEther("1000");
    await expect(
      rewardToken.connect(addr1).transfer(addr2.address, transferAmount)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Should allow approval and set allowance correctly", async function () {
    const approveAmount = ethers.parseEther("2000");

    await rewardToken.approve(addr1.address, approveAmount);
    expect(await rewardToken.allowance(owner.address, addr1.address)).to.equal(
      approveAmount
    );
  });

  it("Should allow transferFrom when approved", async function () {
    const transferAmount = ethers.parseEther("1500");

    await rewardToken.approve(addr1.address, transferAmount);
    await rewardToken
      .connect(addr1)
      .transferFrom(owner.address, addr2.address, transferAmount);

    expect(await rewardToken.balanceOf(addr2.address)).to.equal(transferAmount);
    expect(await rewardToken.allowance(owner.address, addr1.address)).to.equal(
      0
    );
  });

  it("Should fail transferFrom if allowance is insufficient", async function () {
    const transferAmount = ethers.parseEther("3000");

    await expect(
      rewardToken
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, transferAmount)
    ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
  });

  it("Should emit Approval event on successful approve", async function () {
    const approveAmount = ethers.parseEther("2500");

    await expect(rewardToken.approve(addr1.address, approveAmount))
      .to.emit(rewardToken, "Approval")
      .withArgs(owner.address, addr1.address, approveAmount);
  });
});
