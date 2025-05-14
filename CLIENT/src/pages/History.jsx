import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/index';
import { Loader } from '../components';

const History = () => {
  const { address, getDonations, getCampaigns } = useStateContext();
  const [donationDetails, setDonationDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        setLoading(true);

        // Ambil semua campaign
        const campaigns = await getCampaigns();

        const details = [];

        for (const campaign of campaigns) {
          const donations = await getDonations(campaign.pId);

          // Filter donasi berdasarkan wallet pengguna
          const userDonations = donations.filter((donation) => donation.donator.toLowerCase() === address.toLowerCase());

          // Format data donasi
          userDonations.forEach((donation) => {
            details.push({
              donatorWallet: address, // Wallet pengguna
              donationAmount: donation.donation, // Jumlah donasi
              campaignOwnerWallet: campaign.owner, // Wallet campaign owner
              campaignTitle: campaign.title, // Judul campaign
            });
          });
        }

        setDonationDetails(details);
      } catch (error) {
        console.error('Error fetching user donations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchUserDonations();
    }
  }, [address, getDonations, getCampaigns]);

  if (!address) {
    return (
      <h1 className="font-epilogue font-semibold text-[18px] text-[#CAD3F5] text-left">
        Please connect your wallet to view your donations.
      </h1>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (donationDetails.length === 0) {
    return (
      <h1 className="font-epilogue font-semibold text-[18px] text-[#CAD3F5] text-left">
        You haven't made any donations yet.
      </h1>
    );
  }

  return (
    <div className="bg-[#181926] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#363A4F] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#CAD3F5]">Your Donation History 📃</h1>
      </div>

      <div className="w-full mt-[40px]">
        <div className="text-center hidden sm:grid grid-cols-4 gap-[20px] bg-[#1E2030] p-[16px] rounded-[10px]">
          <h4 className="font-epilogue font-semibold text-[#F5A97F] text-[16px]">Your Wallet</h4>
          <h4 className="font-epilogue font-semibold text-[#7DC4E4] text-[16px]">Donation Amount</h4>
          <h4 className="font-epilogue font-semibold text-[#F5BDE6] text-[16px]">Donate to </h4>
          <h4 className="font-epilogue font-semibold text-[#EED49F] text-[16px]">Campaign Title</h4>
        </div>

        <div className="flex flex-col gap-[10px] mt-[20px]">
          {donationDetails.map((detail, index) => (
            <div
              key={index}
              className="text-center flex flex-col sm:grid sm:grid-cols-4 gap-[50px] bg-[#1E2030] p-[16px] rounded-[10px]"
            >
              <p className="font-epilogue text-[14px] text-[#CAD3F5] break-words">{detail.donatorWallet}</p>
              <p className="font-epilogue text-[14px] text-[#CAD3F5]">{detail.donationAmount} ETH</p>
              <p className="font-epilogue text-[14px] text-[#CAD3F5] break-words">{detail.campaignOwnerWallet}</p>
              <p className="font-epilogue text-[14px] text-[#CAD3F5]">{detail.campaignTitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;


