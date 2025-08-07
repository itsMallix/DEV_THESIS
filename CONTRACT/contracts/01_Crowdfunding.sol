// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Crowdfunding {
    struct Campaign {
        address owner; //owner campaign 
        string nameOwner; //nama ownder
        string instagram; //instagram
        string twitter; //twitter
        string telegram; //telegram
        string title; //judul campaign
        string description; //deskkripsi campaign
        uint256 target; //target campaign dalam wei
        uint256 deadline; //deadline campaign dengan unix timestamp
        uint256 amountCollected; //total dana terkumpul
        string image; //link gambar campaign
        address[] donators; //array untuk menyimpan donator
        uint256[] donations; //array untuk menyimpan jumlah donasi
    }

    //mapping data campaigns dengan referensi struct campaign
    mapping(uint256 => Campaign) public campaigns; 
    //init jumlah awal campaign
    uint256 public numberOfCampaigns = 0; 

    //function create campaign dg param struct
    function createCampaign( 
        address _owner,  
        string memory _nameOwner,
        string memory _instagram,
        string memory _twitter,
        string memory _telegram,
        string memory _title,  
        string memory _description, 
        uint256 _target, 
        uint256 _deadline, 
        string memory _image 
    //return value berupa id dari campaign
    ) public returns (uint256) {
        //memastikan deadline lebih dari block timestamps
        require(_deadline > block.timestamp, "The deadline should be a date in the future"); 

        //menyimpan data campaign ke dalam storage dg referensi struct campaign
        Campaign storage campaign = campaigns[numberOfCampaigns]; 
        campaign.owner = _owner;
        campaign.nameOwner = _nameOwner;
        campaign.instagram = _instagram;
        campaign.twitter = _twitter;
        campaign.telegram = _telegram;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        //menambahkan jumlah campaign
        numberOfCampaigns++;

        //return value berupa id campaign
        return numberOfCampaigns - 1;
    }

    //fucntion donateToCampaign
    function donateToCampaign(uint256 _id) public payable {
        //mengambil nilai amount dari msg.value
        uint256 amount = msg.value;
        //donasi ke campaign dengan id
        Campaign storage campaign = campaigns[_id];


        //memastikan deadline belum selesai
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        //memastikan jumlah donasi lebih dari 0
        require(amount > 0, "Donation must be greater than zero");

        //menambahkan donatur ke dalam array
        campaign.donators.push(msg.sender);
        //menambahkan jumlah donasi ke dalam array
        campaign.donations.push(amount);
        
        //menambah jumlah dana terkumpul
        campaign.amountCollected += amount;

        //memanggil function sendDonation dengan param id dan amount
        (bool sent,) = payable(campaign.owner).call{value: amount}("");
        //memastikan donasi terkirims
        require(sent, "Failed to send donation to campaign owner");
    }
    
    //function getDonators
    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        //return value berupa array donatur dan jumlah donasi
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    //function getCampaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        //return value berupa array campaign
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        //looping untuk mengambil semua campaign
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        //return value berupa array campaign
        return allCampaigns;
    }
}