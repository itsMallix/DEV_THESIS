import React from 'react';
import { useAddress, useContract, useTokenBalance } from '@thirdweb-dev/react';
import { TOKEN_REWARD_CONTRACT } from '../env/address';

export default function RewardTokenCard() {
    const address = useAddress();
    const { contract: RewardTokenContract, isLoading: loadingRewardToken } = useContract(TOKEN_REWARD_CONTRACT);
    const { data: tokenBalance, isLoading: loadingTokenBalance } = useTokenBalance(RewardTokenContract, address);

    const isLoading = loadingRewardToken || loadingTokenBalance;

    return (
        <div className="bg-[#1E2030] rounded-2xl p-6 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <h2 className="font-epilogue text-xl font-bold text-[#CAD3F5] mb-4">Your Reward Token</h2>
            
            <div className="bg-[#EED49F] rounded-md p-2 w-full mb-2">
                <h4 className="font-epilogue overflow-x-auto whitespace-nowrap text-md text-[#1E2030]">{TOKEN_REWARD_CONTRACT}</h4>
            </div>
            
            <div className={`h-6 w-1/2 mb-2 rounded-md ${isLoading ? "bg-[#EED49F] animate-pulse" : ""}`}>
                {!isLoading && (
                    <p className="text-lg font-bold text-[#CAD3F5]">
                        {tokenBalance?.symbol}
                    </p>
                )}
            </div>
            
            <div className={`h-6 w-full rounded-md ${isLoading ? "bg-[#EED49F] animate-pulse" : ""}`}>
                {!isLoading && (
                    <p className="text-lg font-epilogue text-[14px] text-[#CAD3F5]">
                        {tokenBalance?.displayValue}
                    </p>
                )}
            </div>
        </div>
    );
}

