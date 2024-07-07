import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

import Tooltip from '@mui/material/Tooltip';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import { FaFlag } from 'react-icons/fa';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft, calculateFundsCollected } from '../utils';
import { thirdweb } from '../assets';

function CampaignDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { donate, getDonations, contract, address, updateStatus, releaseFunds, requestRefund} = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);
  const totalFundsCollected = calculateFundsCollected(state.amountCollected, state.milestoneIndex, state.milestoneFunds);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount);

    navigate('/');
    setIsLoading(false);
  };

  const handleEdit = () => {
    navigate(`/edit/${state.pId}`, {state: state});
  };

  const handleStatus = async () => {
    setIsLoading(true);
    try {
      await updateStatus(state.pId, !state.isActive);
      navigate('/');
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.reason);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      await releaseFunds(state.pId);
    } catch (error) {
      console.error("Error releasing funds:", error);
      toast.error(error.reason);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    setIsLoading(true);
    try {
      await requestRefund(state.pId);
      toast.success('Refund initiated successfully!');
    } catch (error) {
      console.error("Error initiating refund:", error);
      toast.error(error.reason);
    } finally {
      setIsLoading(false);
    }
  };

  const milestones = state.milestones.map((milestone, index) => ({
    description: milestone,
    funds: ethers.utils.formatEther(state.milestoneFunds[index]._hex),
    percentage: calculateBarPercentage(
    state.target,
    state.milestoneFunds.slice(0, index + 1)
      .map(fund => ethers.utils.formatEther(fund._hex))
      .reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
  ),
  }));

  return (
    <div>
      {isLoading && <Loader />}
      <Toaster position="bottom-center" />
      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        <div className='flex-1 flex-col'>
          <img src={state.image} alt='campaign' className='w-full h-[410px] object-cover rounded-xl' />
          <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2'>
            <div
              className='absolute h-full bg-[#4acd8d]'
              style={{
                width: `${calculateBarPercentage(state.target, totalFundsCollected)}%`,
                maxWidth: '100%',
              }}
            ></div>
            {milestones.map((milestone, index) => (
              <Tooltip title={`Milestone ${index + 1}: ${milestone.description} - ${milestone.funds} ETH`}>
                <div
                  key={index}
                  className='absolute h-full'
                  style={{ left: `${milestone.percentage}%` }}
                >
                  <FaFlag className='text-white' />
                </div>
              </Tooltip>
            ))}

          </div>
        </div>

        <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
          {!state.isActive ? (<CountBox title="Status" value='Inactive'/>) : (
              <CountBox title='Days Left' value={remainingDays} />
          )}
          <CountBox title={`Raised of ${state.target}`} value={totalFundsCollected} />
          <CountBox title='Total Backers' value={donators.length} />
        </div>
      </div>

      <div className='mt-[60px] flex lg:flex-row flex-col gap-5'>
        <div className='flex-[2] flex flex-col gap-[40px]'>
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Creator</h4>

            <div className='mt-[20px] flex flex-row flex-wrap justify-between gap-[14px] max-w-[74%]'>
              <div className='flex flex-row items-center flex-wrap gap-[14px]'>
                <div
                  className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'
                >
                  <img src={thirdweb} alt='user' className='w-[60%] h-[60%] object-contain' />
                </div>
                <div>
                  <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>{state.owner}</h4>
                  <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>10 Campaigns</p>
                </div>
              </div>
              <div className={`flex flex-row gap-[10px] ${state.owner !== address ? 'hidden' : ''}`}>
                <Tooltip title='Edit Campaign' className='text-white cursor-pointer' onClick={handleEdit}>
                  <EditOutlinedIcon fontSize='medium' />
                </Tooltip>
                <Tooltip title='Change Campaign Status' className='text-white cursor-pointer' onClick={handleStatus}>
                  {state.isActive ? (<ToggleOnOutlinedIcon fontSize='medium'/>) : (
                    <ToggleOffOutlinedIcon />
                  )}
                </Tooltip>
                <Tooltip title='Withdraw Funds' className='text-white cursor-pointer' onClick={handleWithdraw}>
                  <DownloadOutlinedIcon />
                </Tooltip>
              </div>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Story</h4>

            <div className='mt-[20px]'>
              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Donators</h4>

            <div className='mt-[20px] flex flex-col gap-4'>
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className='flex justify-between items-center gap-4'>
                    <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all'>
                      {index + 1}. {item.donator}
                    </p>
                    <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'>
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='flex-1'>
          <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Fund</h4>

          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]'>
            <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
              Fund the campaign
            </p>
            <div className='mt-[30px]'>
              <input
                type='number'
                placeholder='ETH 0.1'
                step='0.01'
                className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5262] rounded-[10px]'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>
                  Back it because you believe in it.
                </h4>
                <p className='mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]'>
                  Support the project for no reward, just because it speaks to you.
                </p>
              </div>

              <CustomButton btnType='button' title='Fund Campaign' styles={`w-full bg-[#8c6dfd] ${!state.isActive ? 'bg-gray-300 cursor-not-allowed opacity-50' : ''}`} handleClick={state.isActive ? handleDonate : null} />
              {state.isActive && Date.now() < state.deadline && (
                <CustomButton
                  btnType="button"
                  title="Request Refund"
                  styles="w-full text-[#ff0000] mt-[20px] border border-[#ff0000] rounded-[4px] px-[20px] py-[10px]"
                  handleClick={handleRefund}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetails;
