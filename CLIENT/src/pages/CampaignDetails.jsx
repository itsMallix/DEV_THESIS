import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, CountBox, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { metamask } from '../assets';

const CampaignDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { getDonations, donate, contract, address } = useStateContext();

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [donators, setDonators] = useState([]);

    let remainingDays = daysLeft(state.deadline);
    remainingDays = remainingDays > 0 ? remainingDays : 0;

    const fetchDonators = async () => {
        const data = await getDonations(state.pId)

        setDonators(data);
    }

    useEffect(() => {
        if(contract) fetchDonators();
    }, [contract, address]);

    const handleDonate = async () => {
        setIsLoading(true);

        await donate(state.pId, amount);

        navigate('/');
        setIsLoading(false);
    }

    return (
        <div>
            {isLoading && <Loader />}

            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
                <div className="flex-1 flex-col">
                    <img src={state.image} alt="campaign_image" className='w-full h-[410px] object-cover rounded-xl'/>
                    <div className="relative w-full h-[10px] bg-[#363A4F] mt-2 rounded-xl">
                        <div className="absolute h-full bg-[#EED49F] rounded-xl" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
                        </div>
                    </div>
                </div>
                <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
                    <CountBox
                        title="Days Left"
                        value={remainingDays}
                    />
                    <CountBox
                        title={`Goal ${state.target} ETH`}
                        value={`${state.amountCollected} ETH`} 
                    />
                    <CountBox
                        title="Total Backers"
                        value={donators.length}
                    />
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-[#CAD3F5] uppercase">Creator</h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#363A4F] cursor-pointer">
                                <img src={ metamask } alt="user" className='w-[60%] h-[60%] object-contain'/>
                            </div>
                            <div className="">
                                <h4 className="font-epilogue font-semibold text-[14px] text-[#CAD3F5] break-all">{state.owner}</h4>
                                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>Project Owner</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-[#CAD3F5] uppercase">Naration</h4>
                        <div className="mt-[20px]">
                            <p className='mt-[4px] font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.description}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-[#CAD3F5] uppercase">Donators</h4>
                        <div className="mt-[20px] flex flex-col gap-4">
                            {donators.length > 0 ? donators.map((item, index) => (
                                <div key={`${item.donator}-${index}`} className='flex justify-between items-center gap-4'>
                                    <p className='font-wpilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all'>{index + 1}. {item.donator}
                                    </p>   
                                    <p className='font-wpilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'>{item.donation} ETH
                                    </p>   
                                </div>
                            )) : (
                                <p className='mt-[4px] font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No Donators Found</p>
                            )}
                        </div>
                    </div>
                </div>
            <div className="flex-1">
                <h4 className="font-epilogue font-semibold text-[18px] text-[#CAD3F5] uppercase">Fund</h4>
                <div className="mt-[20px] flex flex-col p-4 bg-[#181926] rounded-[10px]">
                    <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">Fund The Campaign
                    </p>
                    <div className="mt-[30px]">
                        <input 
                            type="number"
                            placeholder='0.1 ETH'
                            step="0.01"
                            className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={remainingDays === 0}
                        />

                        <div className="my-[20px] p-4 bg-[#1E2030] rounded-[10px]">
                            <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-[#CAD3F5]'>Your support will be appreciate!</h4>
                            <p className='mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]'>Support the campaign for people around the world</p>
                        </div>

                        <CustomButton
                            btnType="button"
                            title="Fund Campaign"
                            styles={`w-full mt-[24px] ${remainingDays === 0 ? 'bg-[#808191] cursor-not-allowed' : 'bg-[#A6DA95] text-[#1E2030]'}`}
                            handleClick={remainingDays === 0 ? undefined : handleDonate}
                            disabled={remainingDays === 0}
                        />
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default CampaignDetails
