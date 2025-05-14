import React from 'react';
import StakingTokenCard from '../components/StakingTokenCard';
import RewardTokenCard from '../components/RewardTokenCard';
import StakingCard from '../components/StakingCard';

const Staking = () => {
    return (
        <div className='flex flex-col items-center justify-center rounded-[10px] p-12 bg-[#181926] text-[#CAD3F5]'>
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#363A4F] rounded-[10px] mb-8">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#CAD3F5]">Stake To Earn 🌱</h1>
            </div>
            <div className='max-w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                <StakingTokenCard />
                <RewardTokenCard />
            </div>
            <div className='max-w-4xl'>
                <StakingCard />
            </div>
        </div>
    );
};

export default Staking;
