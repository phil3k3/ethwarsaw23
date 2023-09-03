import  { ethers } from 'ethers';
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useAccount, useWalletClient } from "wagmi";
import DaoToken from "../../../hardhat/artifacts/contracts/DaoToken.sol/DaoToken.json";
import FeeProxy from "../../../hardhat/artifacts/contracts/ERC20FeeProxy.json";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";

import * as React from 'react'
import { useState } from 'react';
import { type PublicClient, usePublicClient } from 'wagmi'
import { providers } from 'ethers'
import { type HttpTransport } from 'viem'
 
export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}
 
/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient])
}

export const DataTable = ({ data })  => {

    console.log(DaoToken);
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [buttonText, setButtonText] = useState('Click Me');
    const [loading, setLoading] = useState(false);

    const provider = useEthersProvider()

    async function cancelInvoice(entry) {
        console.log("cancelInvoice " + entry);
        const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
              baseURL: "https://goerli.gateway.request.network/",
            }
        });
  
        const request = await requestClient.fromRequestId(entry.requestId);
        request.cancel({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: address
        });
    }
    
    async function proposeInvoice(entry) {
        setButtonText('Loading...');
        setLoading(true);

        console.log("proposeInvoice " + entry);
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const ethAdapterOwner1 = new EthersAdapter({
            ethers,
            signerOrProvider: provider.getSigner(),
        });

        const txServiceUrl = "https://safe-transaction-goerli.safe.global";
        const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 });

        const safeInfo = await safeService.getSafeInfo("0x6311999EDa3500fD06E2C1F1dFD92Bb19735dE88");
        const safeAddress = safeInfo.address;

        console.log("safeInfo:");
        console.log(safeInfo);

        const spender = "0x399F5EE127ce7432E4921a61b8CF52b0af52cbfE"; //Request Network's fee proxy
        const ethAmount = ethers.utils.parseUnits("0.0", "ether").toString();

        const tokenInterface = new ethers.utils.Interface(DaoToken.abi);
      
        const feeProxyInterface = new ethers.utils.Interface(FeeProxy);

        const encodedDataApprove = tokenInterface.encodeFunctionData("approve", [spender, ethers.utils.parseEther("50.0")]);
        const encodedDataTransfer = feeProxyInterface.encodeFunctionData("transferFromWithReferenceAndFee", [
            "0x9A6D9c95951cE328Bd52174259e6B966E33E8bE6", //_tokenAddress //DAO Token
            "0x6D7e59211Fa846c020c0B44397587133FE95831d", //_to //receiver
            ethers.utils.parseEther("50.0"), //_amount //receiver
            "0x4ea1e62beb09735c", //_paymentReference
            ethers.utils.parseUnits("0.000000000000000001", "ether"), //_feeAmount
            "0x0000000000000000000000000000000000000000", //_feeAddress
        ]);

        console.log("transfer");


        const safeTransactionData: MetaTransactionData[] = [
        {
            to: "0x9A6D9c95951cE328Bd52174259e6B966E33E8bE6", //ERC20 token address DaoToken
            data: encodedDataApprove,
            value: ethAmount,
        },
        {
            to: "0x399F5EE127ce7432E4921a61b8CF52b0af52cbfE", //Request Network smart contract address
            data: encodedDataTransfer,
            value: ethAmount,
        },
        ];

        const safeSdkOwner1 = await Safe.create({
          ethAdapter: ethAdapterOwner1,
          safeAddress: safeAddress,
        });

        console.log(safeSdkOwner1);
        
        const safeTransaction = await safeSdkOwner1.createTransaction({ safeTransactionData });
        const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction);
        const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash);
        console.log("safeTransaction:");
        console.log(safeTransaction);

        await safeService.proposeTransaction({
          safeAddress,
          safeTransactionData: safeTransaction.data,
          safeTxHash,
          senderAddress: address,
          senderSignature: senderSignature.data,
        });

        setButtonText('Proposed');
        setLoading(false);
    }

    return (
        <div className="flex bg-base-300 relative pb-10">
          <div className="flex flex-col flex-grow w-full mx-5 sm:mx-8 2xl:mx-20">
            <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
              <span className="text-4xl sm:text-6xl text-black">Work for review</span>
              <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
                <div className="flex flex-col border border-primary p-1 border-opacity-30 rounded-2xl flex-shrink-0">
                  <div className="flex flex-col border border-primary rounded-2xl p-1 flex-shrink-0 pl-10 pr-10 mt-10 mb-10">
                    <p>Here goes the transaction details to be approved</p>
                  </div>
                  <table>
                  {data.requests.map((entry, index) => (
                    <tr>
                      <td>{entry.githubId}</td>
                      <td class="eth-address">{entry.walletAddress}</td>
                      <td>{entry.amount.length > 10 ? entry.amount : ethers.utils.formatEther(parseInt(entry.amount))}</td>
                      <td>{entry.status}</td>
                      <td>{entry.transactionDate}</td>
                      <td>  <button
                                className="btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
                                onClick={() => proposeInvoice(entry) }
                            >
                            <>Propose</>   
                            </button></td>
                      <td>
                          {entry.multiSigApprovers}
                      </td>
                    </tr>
                  ))}
                  </table>
                </div>
              </div>
    
              <div className="mt-4 flex gap-2 items-start">
                <span className="text-sm leading-tight">Price:</span>
                <div className="badge badge-warning">{ ethers.utils.formatEther(data.price) } ETH + Gas</div>
              </div>
            </div>
          </div>
        </div>
      );
  };