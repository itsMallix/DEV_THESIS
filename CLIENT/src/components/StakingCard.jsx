import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Button, useAddress, useContract, useContractRead, useTokenBalance } from '@thirdweb-dev/react';
import { STAKING_CONTRACT, TOKEN_STAKING_CONTRACT, TOKEN_REWARD_CONTRACT } from '../env/address';

export default function StakingCard() {
  const address = useAddress();

  const { contract: stakeTokenContract } = useContract(
    TOKEN_STAKING_CONTRACT,
    "token"
  );
  const { contract: rewardTokenContract } = useContract(
    TOKEN_REWARD_CONTRACT,
    "token"
  );
  const { contract: stakeContract } = useContract(
    STAKING_CONTRACT,
    "custom"
  );

  const {
    data: stakeInfo,
    refetch: refetchStakeInfo,
    isLoading: loadingStakeInfo,
  } = useContractRead(stakeContract, "getStakeInfo", [address]);

  const { data: stakeTokenBalance, isLoading: loadingStakeTokenBalance } =
    useTokenBalance(stakeTokenContract, address);

  const { data: rewardTokenBalance, isLoading: loadingRewardTokenBalance } =
    useTokenBalance(rewardTokenContract, address);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchStakeInfo();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetchStakeInfo]);

  const [stakeAmount, setStakeAmount] = useState("0");
  const [unstakeAmount, setUnstakeAmount] = useState("0");

  function resetValue() {
    setStakeAmount("0");
    setUnstakeAmount("0");
  }

  return (
    <div className="p-10 mt-6 flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#1E2030] rounded-[10px]">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Stake Card */}
        <div className="bg-[#363A4F] text-white rounded-2xl shadow-lg p-6 w-full lg:w-1/2">
          <div className="text-center mb-6">
            <h2 className="font-epilogue text-xl font-bold mb-2">Stake Token:</h2>
            <p className="text-lg font-medium font-epilogue">
              {loadingStakeInfo || loadingStakeTokenBalance
                ? "Loading..."
                : stakeInfo && stakeInfo[0]
                ? `${ethers.utils.formatEther(stakeInfo[0])} ${stakeTokenBalance?.symbol}`
                : "0"}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full p-3 mb-4 rounded-md bg-gray-800 text-[#CAD3F5] focus:outline-none focus:ring-1 focus:ring-[#B7BDF8]"
                placeholder="Enter stake amount"
              />
              <Web3Button
                contractAddress={STAKING_CONTRACT}
                action={async (contract) => {
                  await stakeTokenContract?.erc20.setAllowance(
                    STAKING_CONTRACT,
                    stakeAmount
                  );
                  await contract.call("stake", [ethers.utils.parseEther(stakeAmount)]);
                  resetValue();
                }}
                className="w-full py-2 rounded-md hover:bg-[#A6DA95] hover:text-[#1E2030]"
              >
                Stake
              </Web3Button>
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="w-full p-3 mb-4 rounded-md bg-gray-800 text-[#CAD3F5] focus:outline-none focus:ring-1 focus:ring-[#B7BDF8]"
                placeholder="Enter unstake amount"
              />
              <Web3Button
                contractAddress={STAKING_CONTRACT}
                action={async (contract) => {
                  await contract.call("unstake", [ethers.utils.parseEther(unstakeAmount)]);
                }}
                className="w-full py-2 rounded-md hover:bg-[#F5A97F] hover:text-[#1E2030]"
              >
                Unstake
              </Web3Button>
            </div>
          </div>
        </div>

        {/* Reward Card */}
        <div className="bg-[#363A4F] text-white rounded-2xl p-6 w-full">
          <div className="text-center mb-6">
            <h2 className="font-epilogue text-xl font-bold mb-2">Reward Token:</h2>
            <p className="font-epilogue text-lg font-medium">
              {loadingStakeInfo || loadingRewardTokenBalance
                ? "Loading..."
                : stakeInfo && stakeInfo[1]
                ? `${ethers.utils.formatEther(stakeInfo[1])} ${rewardTokenBalance?.symbol}`
                : "0"}
            </p>
          </div>

          <div className="flex justify-center">
            <Web3Button
              contractAddress={STAKING_CONTRACT}
              action={async (contract) => {
                await contract.call("claimRewards");
                resetValue();
              }}
              className="w-full max-w-sm bg-green-600 text-white py-2 rounded-md hover:bg-[#F5BDE6] hover:text-[#1E2030]"
            >
              Claim Rewards
            </Web3Button>
          </div>
        </div>
      </div>
    </div>
  );
}
