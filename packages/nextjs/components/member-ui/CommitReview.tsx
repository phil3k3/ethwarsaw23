import { TransactionReceipt } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAccount, useWalletClient } from "wagmi";
import { RequestNetwork, Types }from "@requestnetwork/request-client.js";
import React, { useState, useEffect } from 'react';
import { DataTable } from "./DataTable";
import { ethers } from 'ethers';

export const CommitReview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { address } = useAccount();

  useEffect(() => {
    fetchData();
  }, []);  // The empty dependency array means this effect will run once when the component mounts.
  

  const fetchData = async () => {
    try {
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://goerli.gateway.request.network/",
        }
      });
  
      const requests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address
      });

      const data = {};
      data.requests = [];
      data.price = 0.0;

      console.log(requests);
      

      if (requests) {
        const requestsTransformed = requests.map((request) => {
          return {
            githubId: request.contentData?.reason,
            walletAddress: request.requestData?.payee.value,
            amount: request.requestData?.expectedAmount,
            status: request.requestData?.state,
            transactionDate: request.requestData?.timestamp,
            requestId: request.requestData?.requestId,
            multiSigApprovers: 0
          }
        });

        // const price = requestsTransformed
        //     .map((request) => parseInt(request.amount))
        //     .reduce((a, b) => a + b, 0);
        const price = 0;
          
        console.log(price);

        data.requests = requestsTransformed;
        data.price = price;
      }
      
      console.log(data);
    
      setData(data);
      setLoading(false);
  } catch (err) {
    setError(err);
    setLoading(false);
  }
}
  return (
    <div className="flex bg-base-300 relative pb-10">
      <div className="flex flex-col flex-grow w-full mx-5 sm:mx-8 2xl:mx-20">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error loading data: {error.message}</p>
              ) : (
                <DataTable data={data} />
              )}
      </div>
    </div>
  );
};
