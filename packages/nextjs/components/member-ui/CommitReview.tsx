import { useState } from "react";
import { TransactionReceipt } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const CommitReview = () => {
  const [newGreeting] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "setGreeting",
    args: [newGreeting],
    value: "0.01",
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

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

              <div className="flex items-center rounded-2xl justify-around">
                <button
                  className="btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
                  onClick={() => writeAsync()}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Approve</>}
                </button>
                <button
                  className="btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
                  onClick={() => writeAsync()}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Reject</>}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 items-start">
            <span className="text-sm leading-tight">Price:</span>
            <div className="badge badge-warning">0.01 ETH + Gas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
