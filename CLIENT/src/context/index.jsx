import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { CROWDFUNDING_CONTRACT } from '../env/address';

import Utf8 from 'crypto-js/enc-utf8';
import CryptoJS from 'crypto-js';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CROWDFUNDING_CONTRACT);
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  // const publishCampaign = async (form) => {
  //   try {
  //     const secretKey = "MyS3cReTK3y";
  //     const encryptedTitle = CryptoJS.AES.encrypt(form.title, secretKey).toString();
  //     const encryptedDescription = CryptoJS.AES.encrypt(form.description, secretKey).toString();
      
  //     console.log('Encrypted Title:', encryptedTitle);
  //     console.log('Encrypted Description:', encryptedDescription);
      
  //     const data = await createCampaign({
  //       args: [
  //         address,
  //         form.name,
  //         form.instagram,
  //         form.twitter,
  //         form.telegram,
  //         encryptedTitle,
  //         encryptedDescription,
  //         form.target,
  //         new Date(form.deadline).getTime(),
  //         form.image,
  //       ],
  //     });
  //     console.log('Campaign created successfully:', data);
  //   } catch (error) {
  //     console.error('Failed to create campaign:', error);
  //   }
  // };

  // const getCampaigns = async () => {
  //   try {
  //     const secretKey = "MyS3cReTK3y";
  //     const campaigns = await contract.call('getCampaigns');
      
  //     const parsedCampaigns = campaigns.map((campaign, i) => {
  //       let decryptedTitle = '';
  //       let decryptedDescription = '';

  //       try {
  //         // Validasi dan dekripsi title
  //         if (campaign.title && campaign.title.trim() !== '') {
  //           console.log('Raw title from contract:', campaign.title);
  //           const decryptedTitleBytes = CryptoJS.AES.decrypt(campaign.title, secretKey);
  //           decryptedTitle = decryptedTitleBytes.toString(CryptoJS.enc.Utf8);
            
  //           // Cek apakah hasil dekripsi valid
  //           if (!decryptedTitle || decryptedTitle.trim() === '') {
  //             console.warn(`Failed to decrypt title for campaign ${i}, using raw data`);
  //             decryptedTitle = campaign.title;
  //           }
  //         } else {
  //           decryptedTitle = campaign.title || 'Untitled Campaign';
  //         }

  //         // Validasi dan dekripsi description
  //         if (campaign.description && campaign.description.trim() !== '') {
  //           console.log('Raw description from contract:', campaign.description);
  //           const decryptedDescriptionBytes = CryptoJS.AES.decrypt(campaign.description, secretKey);
  //           decryptedDescription = decryptedDescriptionBytes.toString(CryptoJS.enc.Utf8);
            
  //           // Cek apakah hasil dekripsi valid
  //           if (!decryptedDescription || decryptedDescription.trim() === '') {
  //             console.warn(`Failed to decrypt description for campaign ${i}, using raw data`);
  //             decryptedDescription = campaign.description;
  //           }
  //         } else {
  //           decryptedDescription = campaign.description || 'No description available';
  //         }

  //         console.log(`Campaign ${i} - Decrypted Title:`, decryptedTitle);
  //         console.log(`Campaign ${i} - Decrypted Description:`, decryptedDescription);

  //       } catch (decryptError) {
  //         console.error(`Decryption error for campaign ${i}:`, decryptError);
  //         // Fallback ke data asli jika dekripsi gagal
  //         decryptedTitle = campaign.title || 'Untitled Campaign';
  //         decryptedDescription = campaign.description || 'No description available';
  //       }

  //       return {
  //         owner: campaign.owner,
  //         title: decryptedTitle,
  //         description: decryptedDescription,
  //         target: ethers.utils.formatEther(campaign.target.toString()),
  //         deadline: campaign.deadline.toNumber(),
  //         amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
  //         image: campaign.image,
  //         instagram: campaign.instagram,
  //         twitter: campaign.twitter,
  //         telegram: campaign.telegram,
  //         donators: campaign.donators,
  //         donations: campaign.donations.map((donation) =>
  //           ethers.utils.formatEther(donation.toString())
  //         ),
  //         pId: i,
  //       };
  //     });
      
  //     return parsedCampaigns;
  //   } catch (error) {
  //     console.error('Failed to fetch all data:', error);
  //     return [];
  //   }
  // };


  const publishCampaign = async (form) => {
  try {
    const secretKey = "MyS3cReTK3y";

    // Enkripsi hanya untuk name, instagram, twitter, telegram
    const encryptedName = CryptoJS.AES.encrypt(form.name, secretKey).toString();
    const encryptedInstagram = CryptoJS.AES.encrypt(form.instagram, secretKey).toString();
    const encryptedTwitter = CryptoJS.AES.encrypt(form.twitter, secretKey).toString();
    const encryptedTelegram = CryptoJS.AES.encrypt(form.telegram, secretKey).toString();

    console.log('Name:', encryptedName);
    console.log('Title', form.title);
    console.log('Description', form.description);
    console.log('Instagram:', encryptedInstagram);
    console.log('Twitter:', encryptedTwitter);
    console.log('Telegram:', encryptedTelegram);
    console.log('Target:', form.target);
    console.log('Deadline:', form.deadline);
    console.log('Image:', form.image);

    const data = await createCampaign({
      args: [
        address,
        encryptedName,      // terenkripsi
        encryptedInstagram, // terenkripsi
        encryptedTwitter,   // terenkripsi
        encryptedTelegram,  // terenkripsi
        form.title,         // plain text
        form.description,   // plain text
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
    const secretKey = "MyS3cReTK3y";
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign, i) => {
      let decryptedName = '';
      let decryptedInstagram = '';
      let decryptedTwitter = '';
      let decryptedTelegram = '';


      try {
        // Dekripsi name
        if (campaign.name && campaign.name.trim() !== '') {
          const bytes = CryptoJS.AES.decrypt(campaign.name, secretKey);
          decryptedName = bytes.toString(CryptoJS.enc.Utf8) || campaign.name;
        } else {
          decryptedName = campaign.name;
        }

        // Dekripsi instagram
        if (campaign.instagram && campaign.instagram.trim() !== '') {
          const bytes = CryptoJS.AES.decrypt(campaign.instagram, secretKey);
          decryptedInstagram = bytes.toString(CryptoJS.enc.Utf8) || campaign.instagram;
        } else {
          decryptedInstagram = campaign.instagram || '-';
        }

        // Dekripsi twitter
        if (campaign.twitter && campaign.twitter.trim() !== '') {
          const bytes = CryptoJS.AES.decrypt(campaign.twitter, secretKey);
          decryptedTwitter = bytes.toString(CryptoJS.enc.Utf8) || campaign.twitter;
        } else {
          decryptedTwitter = campaign.twitter || '-';
        }

        // Dekripsi telegram
        if (campaign.telegram && campaign.telegram.trim() !== '') {
          const bytes = CryptoJS.AES.decrypt(campaign.telegram, secretKey);
          decryptedTelegram = bytes.toString(CryptoJS.enc.Utf8) || campaign.telegram;
        } else {
          decryptedTelegram = campaign.telegram || '-';
        }

      } catch (err) {
        console.error(`Decryption error in campaign ${i}:`, err);
        decryptedName = campaign.name;
        decryptedInstagram = campaign.instagram;
        decryptedTwitter = campaign.twitter;
        decryptedTelegram = campaign.telegram;
      }

      console.log(`=== Campaign ${i} Identitas ===`);
      console.log("Owner:", campaign.owner);
      console.log("Name (decrypted):", decryptedName);
      console.log("Instagram (decrypted):", decryptedInstagram);
      console.log("Twitter (decrypted):", decryptedTwitter);
      console.log("Telegram (decrypted):", decryptedTelegram);
      console.log("Title:", campaign.title);
      console.log("Description:", campaign.description);
      console.log("Target (ETH):", ethers.utils.formatEther(campaign.target.toString()));
      console.log("Deadline:", campaign.deadline.toNumber());
      console.log("Amount Collected (ETH):", ethers.utils.formatEther(campaign.amountCollected.toString()));
      console.log("Image URL:", campaign.image);
      console.log("Donators:", campaign.donators);
      console.log("Donations:", campaign.donations.map((donation) =>
        ethers.utils.formatEther(donation.toString())
      ));
      console.log("============================");

      return {
        owner: campaign.owner,
        name: decryptedName, // sudah di-decrypt
        instagram: decryptedInstagram,
        twitter: decryptedTwitter,
        telegram: decryptedTelegram,
        title: campaign.title, // plain text
        description: campaign.description, // plain text
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        donators: campaign.donators,
        donations: campaign.donations.map((donation) =>
          ethers.utils.formatEther(donation.toString())
        ),
        pId: i,
      };
    });

    return parsedCampaigns;
  } catch (error) {
    console.error('Failed to fetch all data:', error);
    return [];
  }
};

  // Helper function untuk test enkripsi/dekripsi
  const testEncryption = (text) => {
    try {
      const secretKey = "MyS3cReTK3y";
      const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
      const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
      
      console.log('Original:', text);
      console.log('Encrypted:', encrypted);
      console.log('Decrypted:', decrypted);
      console.log('Match:', text === decrypted);
      
      return { encrypted, decrypted, match: text === decrypted };
    } catch (error) {
      console.error('Test encryption error:', error);
      return null;
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
        testEncryption, // Helper function untuk debugging
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
