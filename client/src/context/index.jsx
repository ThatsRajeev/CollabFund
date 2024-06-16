import React, { useState, useEffect, useContext, createContext } from 'react';
import { useConnect, useAddress, metamaskWallet, useContract, useContractWrite, Web3Button } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xaBfEfD997db2653830AE4BFFBEDdbb4d2969561A');
    const { mutateAsync: CreateCampaign } = useContractWrite(contract, 'createCampaign');

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
        try {
            const data = await CreateCampaign({
                args: [
                    address, // owner
                    form.title, // title
                    form.description,  // description
                    ethers.utils.parseUnits(form.target, 18), // target amount (converted to wei)
                    new Date(form.deadline).getTime(), // deadline
                    form.image, // image
                ],
            });
            console.log("contract call success ", data);
        } catch (error) {
            console.log("contract call failed ", error);
        }
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

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect : handleConnect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
