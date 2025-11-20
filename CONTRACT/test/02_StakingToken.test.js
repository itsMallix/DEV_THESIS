const { expect } = require("chai");
const { ethers } = require("ethers");
const { ethers: hardhatEthers } = require("hardhat");

//ambil sc staking token
describe("StakingToken", function () {
  let StakingToken, stakingToken, owner, addr1, addr2; //deklarasi variabel

  beforeEach(async function () {
    StakingToken = await hardhatEthers.getContractFactory("StakingToken");
    [owner, addr1, addr2] = await hardhatEthers.getSigners();

    stakingToken = await StakingToken.deploy();
    await stakingToken.waitForDeployment();
  });

  //kondisi 1 sc harus bisa deploy token dengan supply tertentu
  it("Should deploy with correct total supply", async function () {
    const totalSupply = await stakingToken.totalSupply();
    expect(await stakingToken.balanceOf(owner.address)).to.equal(totalSupply);
  });

  //kondisi 2 sc harus bisa transfer token
  it("Should allow transfer of tokens between accounts", async function () {
    const transferAmount = ethers.parseEther("1000");

    await stakingToken.transfer(addr1.address, transferAmount);
    expect(await stakingToken.balanceOf(addr1.address)).to.equal(
      transferAmount
    );
    expect(await stakingToken.balanceOf(owner.address)).to.equal(
      (await stakingToken.totalSupply()) - transferAmount
    );
  });

  //kondisi 3 sc harus bisa emit transfer
  it("Should emit Transfer event on successful transfer", async function () {
    const transferAmount = ethers.parseEther("500");
    await expect(stakingToken.transfer(addr1.address, transferAmount))
      .to.emit(stakingToken, "Transfer")
      .withArgs(owner.address, addr1.address, transferAmount);
  });

  //kondisi 4 sc harus bisa transfer token
  it("Should fail if sender does not have enough balance", async function () {
    const transferAmount = ethers.parseEther("1000");
    await expect(
      stakingToken.connect(addr1).transfer(addr2.address, transferAmount)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  //kondisi 5 sc harus bisa approve
  it("Should allow approval and set allowance correctly", async function () {
    const approveAmount = ethers.parseEther("2000");

    await stakingToken.approve(addr1.address, approveAmount);
    expect(await stakingToken.allowance(owner.address, addr1.address)).to.equal(
      approveAmount
    );
  });

  //kondisi 6 sc harus bisa transferFrom
  it("Should allow transferFrom when approved", async function () {
    const transferAmount = ethers.parseEther("1500");

    await stakingToken.approve(addr1.address, transferAmount);
    await stakingToken
      .connect(addr1)
      .transferFrom(owner.address, addr2.address, transferAmount);

    expect(await stakingToken.balanceOf(addr2.address)).to.equal(
      transferAmount
    );
    expect(await stakingToken.allowance(owner.address, addr1.address)).to.equal(
      0
    );
  });

  //kondisi 7 sc harus bisa transferFrom
  it("Should fail transferFrom if allowance is insufficient", async function () {
    const transferAmount = ethers.parseEther("3000");

    await expect(
      stakingToken
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, transferAmount)
    ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
  });

  //kondisi 8 sc harus bisa emit approval
  it("Should emit Approval event on successful approve", async function () {
    const approveAmount = ethers.parseEther("2500");

    await expect(stakingToken.approve(addr1.address, approveAmount))
      .to.emit(stakingToken, "Approval")
      .withArgs(owner.address, addr1.address, approveAmount);
  });
});
