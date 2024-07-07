import React, { useState, useEffect, useContext, createContext } from 'react';
import { useConnect, useAddress, metamaskWallet, useContract, useContractWrite, Web3Button } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x83605CcC2b732f649cdBBD1F55046923eB9d5840');
    const { mutateAsync: CreateCampaign } = useContractWrite(contract, 'createCampaign');
    const { mutateAsync: EditCampaign } = useContractWrite(contract, 'editCampaign');

    const walletConfig = metamaskWallet();
    const connect = useConnect();
    const address = useAddress();

    const handleConnect = async () => {
        try {
            const wallet = await connect(walletConfig);
            console.log("connected to", wallet);
        } catch(e) {
            console.error("failed to connect", e);
        }
    }

    const publishCampaign = async (form) => {
      const milestones = form.mileStones.map((milestone) => milestone.name);
      const milestoneFunds = form.mileStones.map((milestone) => Number(milestone.funds));

      const totalTarget = milestoneFunds.reduce((partialSum, a) => partialSum + a, 0).toString();

      const data = await CreateCampaign({
          args: [
              form.title,
              form.description,
              ethers.utils.parseUnits(totalTarget, 18),
              new Date(form.deadline).getTime(),
              milestones,
              milestoneFunds.map(fund => ethers.utils.parseUnits(fund.toString(), 18)),
              form.category,
              form.image,
          ],
      });
  }

    const editCampaign = async (pId, form) => {
      const data = await EditCampaign({
        args: [
          pId,
          form.title,
          form.description,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther
            (campaign.amountCollected.toString()),
            isActive: campaign.isActive,
            milestoneIndex: campaign.milestoneIndex,
            milestones: campaign.milestones,
            milestoneFunds: campaign.milestoneFunds,
            category: campaign.category,
            image: campaign.image,
            pId: i
        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) =>
            campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', [pId],
            {value: ethers.utils.parseEther(amount)}
        );

        return data;
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for(let i=0; i<numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i]).toString()
            })
        }

        return parsedDonations;
    }

    const releaseFunds = async (pId) => {
      const data = await contract.call('releaseFunds', [pId]);
      return data;
    }

    const requestRefund = async (pId) => {
      const data = await contract.call('requestRefund', [pId]);
      return data;
    }

    const updateStatus = async (pId, status) => {
      const data = await contract.call('updateStatus', [pId, status],);
      return data;
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect : handleConnect,
                createCampaign: publishCampaign,
                editCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                releaseFunds,
                requestRefund,
                updateStatus,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
