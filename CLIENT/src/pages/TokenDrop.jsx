import React from 'react';
import TokenDropCard from '../components/TokenDropCard';

const TokenDrop = () => {
    return (
        <div className="flex flex-col items-center justify-center rounded-[10px] p-12 bg-[#181926] text-[#CAD3F5] ">
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#363A4F] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#CAD3F5]">Claim Your Token 🪙</h1>
            </div>
            <TokenDropCard />
        </div>
    );
};

export default TokenDrop;
