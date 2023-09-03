import { ethers } from 'ethers';
import TokenExchanger from "../../../../hardhat/artifacts/contracts/TokenExchanger.sol/TokenExchanger.json";
import { usePrepareContractWrite, useContractWrite } from "wagmi";

const tokenExchangerAbi = TokenExchanger.abi;
const contractAddress = '0x603D49073238e6494815819c58E7ff7f285665d6';

export const TaskList = () => {

    const { config } = usePrepareContractWrite({
      address: contractAddress,
      abi: tokenExchangerAbi,
      functionName: 'redeemDaoTokens',
      args: [parseInt("50000000000000000000")],
    })

    const { write } = useContractWrite(config)


  return (
    <div className="flex flex-col justify-center item-center px-4 md:px-0">
      <h1 className="text-center mb-10">Your approved tasks are:</h1>
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl bg-base-300 pb-10 pt-10">
        <div className="flex flex-col item-center justify-center">
          <div>
            <form  name="retreiveform" className="flex flex-col item-center justify-around">
              <div className="flex flex-grow item-center justify-around mb-5 bg-base-300">
                <label>
              
                  <div>
                    <p className="ml-10 text-bold gap-12">
                      Amount available to retreive: 50 Tokens
                    </p>
                  </div>
                
                  <input className="ml-10 text-black gap-12" type="payment" name="expected-amount" step="any"/>
                  <button className="border-solid ml-10 bg-base-100 pt-5 pb-5 pl-10 pr-10" onClick={() => write?.()}>Redeem</button>
                </label>
              </div>
            </form>
            <div className="flex flex-col item-center justify-center">
              <p className="text-center text-bold ">100 DT = $102.5</p>
            </div>
          </div>

        </div>
          
      </div>
    </div>
  );
};
