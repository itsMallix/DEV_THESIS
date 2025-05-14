import React from 'react';
import { useStateContext } from '../context';
import { metamask } from '../assets';

const ConnectWalletButton = () => {
    const { connect, address } = useStateContext();

    return (
        <button
            type="button"
            className={`flex items-center gap-2 font-epilogue font-semibold text-[16px] leading-[26px] text-[#363A4F] min-h-[52px] px-4 rounded-[10px] border-2 ${
                address ? 'bg-[#A6DA95] border-[#A6DA95]' : 'bg-[#F5BDE6] border-[#F5BDE6]'
            }`}
            onClick={() => {
                if (!address) connect();
                else console.log('Connected wallet:', address);
            }}
        >
            {address && (
                <img
                    src={metamask}
                    alt="MetaMask Logo"
                    className="w-[20px] h-[20px] object-contain"
                />
            )}
            {address
                ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
                : 'Connect Wallet'}
        </button>
    );
};

export default ConnectWalletButton;
