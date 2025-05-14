const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseUnits } = ethers; 

describe("TokenDrop", function () {
    let TokenDrop, tokenDrop, RewardToken, rewardToken, owner, addr1, addr2;

    beforeEach(async function () {
        RewardToken = await ethers.getContractFactory("StakingToken");
        rewardToken = await RewardToken.deploy(); // Tidak perlu .deployed()

        TokenDrop = await ethers.getContractFactory("TokenDrop");
        [owner, addr1, addr2] = await ethers.getSigners();
        tokenDrop = await TokenDrop.deploy(await rewardToken.getAddress()); // ✅ Gunakan getAddress()

        // console.log("RewardToken deployed at:", await rewardToken.getAddress());
        // console.log("TokenDrop deployed at:", await tokenDrop.getAddress());

        const initialBalance = parseUnits("1000", 18); // ✅ Ubah ini
        await rewardToken.transfer(owner.address, initialBalance);

        // Approve the TokenDrop contract untuk menghabiskan 100 token
        await rewardToken.connect(owner).approve(await tokenDrop.getAddress(), parseUnits("100", 18));

        // Deposit 100 token ke TokenDrop contract
        await tokenDrop.connect(owner).depositTokens(parseUnits("100", 18));
    });

    it("Should set the correct token address", async function () {
        expect(await tokenDrop.stakingToken()).to.equal(await rewardToken.getAddress()); // ✅ Gunakan getAddress()
    });

    it("Should allow users to claim token once", async function () {
        await tokenDrop.connect(addr1).claimToken();
        expect(await rewardToken.balanceOf(addr1.address)).to.equal(parseUnits("1", 18));

        await expect(tokenDrop.connect(addr1).claimToken()).to.be.revertedWith("You have already claimed");
    });

    it("Should allow only owner to deposit tokens", async function () {
        await expect(tokenDrop.connect(addr1).depositTokens(parseUnits("50", 18)))
            .to.be.revertedWith("Ownable: caller is not the owner");

        // Owner deposits 50 more tokens
        await rewardToken.connect(owner).approve(await tokenDrop.getAddress(), parseUnits("50", 18));
        await tokenDrop.connect(owner).depositTokens(parseUnits("50", 18));

        expect(await rewardToken.balanceOf(tokenDrop.getAddress())).to.equal(parseUnits("150", 18));
    });

    it("Should allow only owner to withdraw tokens", async function () {
        await expect(tokenDrop.connect(addr1).withdrawTokens(parseUnits("50", 18)))
            .to.be.revertedWith("Ownable: caller is not the owner");

        await tokenDrop.connect(owner).withdrawTokens(parseUnits("50", 18));
        expect(await rewardToken.balanceOf(owner.address)).to.be.greaterThan(parseUnits("900", 18));
    });

    it("Should update contract balance after deposits and withdrawals", async function () {
        expect(await tokenDrop.getDepositedSupply()).to.equal(parseUnits("100", 18));
    
        // Tambahkan approval sebelum deposit tambahan
        await rewardToken.connect(owner).approve(await tokenDrop.getAddress(), parseUnits("50", 18));
        await tokenDrop.connect(owner).depositTokens(parseUnits("50", 18));
        expect(await tokenDrop.getDepositedSupply()).to.equal(parseUnits("150", 18));
    
        await tokenDrop.connect(owner).withdrawTokens(parseUnits("30", 18));
        expect(await tokenDrop.getDepositedSupply()).to.equal(parseUnits("120", 18));
    });
    
});
