import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { CROWDFUNDING_CONTRACT } from '../env/address';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CROWDFUNDING_CONTRACT);
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address,
          form.name,
          form.instagram,
          form.twitter,
          form.telegram,
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log('Campaign created successfully:', data);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call('getCampaigns');
      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        instagram: campaign.instagram,
        twitter: campaign.twitter,
        telegram: campaign.telegram,
        donators: campaign.donators,
        donations: campaign.donations.map((donation) =>
          ethers.utils.formatEther(donation.toString())
        ),
        pId: i,
      }));
      return parsedCampaigns;
    } catch (error) {
      console.error('Failed to fetch all data:', error);
      return [];
    }
  };

  const donate = async (pId, amount) => {
    try {
      const transaction = await contract.call('donateToCampaign', [pId], {
        value: ethers.utils.parseEther(amount),
      });
      console.log('Donation successful:', transaction);
      return transaction;
    } catch (error) {
      console.error('Donation failed:', error);
      throw error;
    }
  };

  const getDonations = async (pId) => {
    try {
      const donations = await contract.call('getDonators', [pId]);
      const parsedDonations = donations[0].map((donator, i) => ({
        donator,
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      }));
      return parsedDonations;
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);