import React, { useState } from "react";
import { Web3Button, useAddress, useContract } from "@thirdweb-dev/react";
import { TOKEN_DROP_CONTRACT } from "../env/address";
// import { FaEthereum } from "react-icons/fa";

export default function TokenDropCard() {
  const address = useAddress();
  const { contract } = useContract(TOKEN_DROP_CONTRACT);
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="flex justify-center items-center p-12">
      <div className="bg-[#1E2030] text-white rounded-2xl p-6 w-80 shadow-lg border border-[#CAD3F5]">
        <h2 className="text-xl font-bold text-center mb-4">Claim Your Staking Token</h2>
        <p className="text-center text-gray-400 mb-6">
          Click the button below to claim your free token.
        </p>
        <div className="flex justify-center">
          <Web3Button
            contractAddress={TOKEN_DROP_CONTRACT}
            action={async (contract) => {
              try {
                await contract.call("claimToken");
                setClaimed(true);
              } catch (error) {
                console.error("Claim failed", error);
              }
            }}
            isDisabled={claimed}
            className="bg-[#C6A0F6] text-white py-2 px-4 rounded-md hover:bg-[#C6A0F6]"
          >
            {claimed ? "Claimed" : "Claim Token"}
          </Web3Button>
        </div>
      </div>
    </div>
  );
}