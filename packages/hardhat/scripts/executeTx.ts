/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { SafeFactory } from "@safe-global/protocol-kit";
import Safe from "@safe-global/protocol-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
require("dotenv").config();

async function main() {
  // https://chainlist.org/?search=goerli&testnets=true
  const RPC_URL = "https://eth-goerli.g.alchemy.com/v2/VAvyk96fsz99L8kDvtA-Eb_XzF9eB5rO";
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  // Initialize signers
  const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider);
  //const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider);
  // const owner3Signer = new ethers.Wallet(process.env.OWNER_4_PRIVATE_KEY!, provider);

  const ethAdapterOwner2 = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer,
  });

  const txServiceUrl = "https://safe-transaction-goerli.safe.global";
  const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner2 });

  /* This Safe is tied to owner 1 because the factory was initialized with
  an adapter that had owner 1 as the signer. */

  const safeInfo = await safeService.getSafeInfo("0x6311999EDa3500fD06E2C1F1dFD92Bb19735dE88");
  const safeAddress = safeInfo.address;

  console.log("safeInfo:");
  console.log(safeInfo);

  //FETCHING THE PROPSED TX
  let pendingTxs = (await safeService.getPendingTransactions(safeAddress)).results;

  console.log("pendingTxs:");
  console.log(pendingTxs);

  let tx = pendingTxs[0];
  console.log("tx:");
  console.log(tx);

  let txConfirmations = tx.confirmations;
  console.log("txConfirmations:");
  console.log(txConfirmations);

  (txConfirmations?.length || 0) >= safeInfo.threshold
    ? console.log("Tx ready to be executed!")
    : console.log("Tx needs more confimations");

  //CREATING SDK
  const safeSdkOwner2 = await Safe.create({
    ethAdapter: ethAdapterOwner2,
    safeAddress: safeAddress,
  });

  console.log("safeSdkOwner2:");
  console.log(safeSdkOwner2);

  const txHash = tx.safeTxHash;
  const safeTransaction = await safeService.getTransaction(txHash);
  console.log("safeTransaction:");
  console.log(safeTransaction);
  const executeTxResponse = await safeSdkOwner2.executeTransaction(safeTransaction);
  console.log("executeTxResponse:");
  console.log(executeTxResponse);
  const receipt = await executeTxResponse.transactionResponse?.wait();
  console.log("executeTxResponse.transactionResponse:");
  console.log(executeTxResponse.transactionResponse);

  console.log("receipt:");
  console.log(receipt);

  console.log("Transaction executed:");
}

// Using this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
