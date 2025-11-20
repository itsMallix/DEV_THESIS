const { expect } = require("chai");
const { ethers } = require("ethers");
const { ethers: hardhatEthers } = require("hardhat");

//ambil sc crowdfunding
describe("Crowdfunding", function () {
  let Crowdfunding, crowdfunding, owner, addr1, addr2; //deklarasi variabel

  beforeEach(async function () {
    // Ambil akun penguji
    [owner, addr1, addr2] = await hardhatEthers.getSigners();

    // Deploy smart contract
    Crowdfunding = await hardhatEthers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
    await crowdfunding.waitForDeployment();
  });

  //kondisi 1 buka crowdfunding
  it("Should create a campaign successfully", async function () {
    const tx = await crowdfunding.createCampaign(
      owner.address,
      "John Doe",
      "john_instagram",
      "john_twitter",
      "john_telegram",
      "Help Needed",
      "We need funds for a cause",
      ethers.parseEther("1.0"), // 1 ETH target
      Math.floor(Date.now() / 1000) + 86400, // 1 day from now
      "https://example.com/image.jpg"
    );

    await tx.wait(); // Tunggu transaksi selesai

    const campaign = await crowdfunding.getCampaigns();
    expect(campaign.length).to.equal(1);
    expect(campaign[0].title).to.equal("Help Needed");
  });

  //kondisi 2 kampanye gaboleh melampaui deadline
  it("Should not allow create campaign with past deadline", async function () {
    await expect(
      crowdfunding.createCampaign(
        owner.address,
        "John Doe",
        "john_instagram",
        "john_twitter",
        "john_telegram",
        "Help Needed",
        "We need funds for a cause",
        ethers.parseEther("1.0"),
        Math.floor(Date.now() / 1000) - 1000, // Past deadline
        "https://example.com/image.jpg"
      )
    ).to.be.revertedWith("The deadline should be a date in the future"); //return jika salah
  });

  //kondisi 3 donasi harus di kampanye aktif ygt
  it("Should allow donations to an active campaign", async function () {
    await crowdfunding.createCampaign(
      owner.address,
      "John Doe",
      "john_instagram",
      "john_twitter",
      "john_telegram",
      "Help Needed",
      "We need funds for a cause",
      ethers.parseEther("1.0"),
      Math.floor(Date.now() / 1000) + 86400, // 1 day from now
      "https://example.com/image.jpg"
    );

    const totalDonation = ethers.parseEther("2.0");

    await crowdfunding
      .connect(addr1)
      .donateToCampaign(0, { value: ethers.parseEther("1.0") });
    await crowdfunding
      .connect(addr2)
      .donateToCampaign(0, { value: ethers.parseEther("1.0") });

    const campaigns = await crowdfunding.getCampaigns(); // Ambil semua campaign
    const campaign = campaigns[0]; // Ambil campaign pertama
    expect(campaign.amountCollected).to.equal(totalDonation); // Bandingkan dengan jumlah yang diharapkan
  });

  //kondisi 4 gaboleh donasi ketika lewat tanggal
  it("Should not allow donations after campaign deadline", async function () {
    await crowdfunding.createCampaign(
      owner.address,
      "John Doe",
      "@johndoe",
      "@johndoe",
      "@johndoe",
      "Save the Planet",
      "Let's save the planet together",
      ethers.parseEther("10"),
      Math.floor(Date.now() / 1000) + 86400, // Deadline 1 hari dari sekarang
      "https://example.com/image.jpg"
    );

    // Majukan waktu agar campaign dianggap berakhir
    await network.provider.send("evm_increaseTime", [86400]); // Tambah 1 hari
    await network.provider.send("evm_mine"); // Tambahkan blok baru

    const totalDonation = ethers.parseEther("1.0");

    await expect(
      crowdfunding.connect(addr1).donateToCampaign(0, { value: totalDonation })
    ).to.be.revertedWith("Campaign has ended"); // Pastikan transaksi gagal
  });

  //kondisi 5 sc harus bisa nyimpen data donator
  it("Should store donator address and donation amount", async function () {
    const latestBlock = await hardhatEthers.provider.getBlock("latest");
    const deadline = latestBlock.timestamp + 86400; // Tambah 1 hari dari waktu blok terbaru

    await crowdfunding.createCampaign(
      owner.address,
      "John Doe",
      "john_instagram",
      "john_twitter",
      "john_telegram",
      "Sc Testing",
      "Smart Contract Testing",
      ethers.parseEther("10"),
      deadline, // Gunakan deadline dari latest block
      "https://example.com/image.jpg"
    );

    const donation1 = ethers.parseEther("1.0");
    const donation2 = ethers.parseEther("2.0");

    await crowdfunding.connect(addr1).donateToCampaign(0, { value: donation1 });
    await crowdfunding.connect(addr2).donateToCampaign(0, { value: donation2 });

    const [donators, donations] = await crowdfunding.getDonators(0);

    expect(donators.length).to.equal(2);
    expect(donators[0]).to.equal(addr1.address);
    expect(donators[1]).to.equal(addr2.address);
    expect(donations[0]).to.equal(donation1);
    expect(donations[1]).to.equal(donation2);
  });

  //kondisi 6 sc harus bisa nyimpen dan nampilin data kampanye
  it("Should retrieve all campaigns", async function () {
    const target = ethers.parseEther("10");
    const deadline = Math.floor(Date.now() / 1000) + 96400;

    await crowdfunding.createCampaign(
      owner.address,
      "John Doe",
      "@johndoe",
      "@johndoe",
      "@johndoe",
      "Campaign 1",
      "First campaign",
      target,
      deadline,
      "image_url"
    );

    await crowdfunding.createCampaign(
      owner.address,
      "Jane Doe",
      "@janedoe",
      "@janedoe",
      "@janedoe",
      "Campaign 2",
      "Second campaign",
      target,
      deadline,
      "image_url"
    );

    const campaigns = await crowdfunding.getCampaigns();

    expect(campaigns.length).to.equal(2);
    expect(campaigns[0].title).to.equal("Campaign 1");
    expect(campaigns[1].title).to.equal("Campaign 2");
  });
});
