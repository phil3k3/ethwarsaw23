/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { SafeFactory } from "@safe-global/protocol-kit";
import Safe from "@safe-global/protocol-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
require("dotenv").config();

async function main() {
  // https://chainlist.org/?search=goerli&testnets=true
  const RPC_URL = "https://eth-goerli.g.alchemy.com/v2/VAvyk96fsz99L8kDvtA-Eb_XzF9eB5rO";
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const tokenABI = require("../artifacts/contracts/DaoToken.sol/DaoToken.json").abi;
  const tokenInterface = new ethers.utils.Interface(tokenABI);

  const feeProxyABI = require("../artifacts/ERC20FeeProxy.json");
  const feeProxyInterface = new ethers.utils.Interface(feeProxyABI);

  // Initialize signers
  const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider);
  // const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider);
  // const owner3Signer = new ethers.Wallet(process.env.OWNER_4_PRIVATE_KEY!, provider);

  const ethAdapterOwner1 = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer,
  });

  const txServiceUrl = "https://safe-transaction-goerli.safe.global";
  const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 });

  /* This Safe is tied to owner 1 because the factory was initialized with
  an adapter that had owner 1 as the signer. */

  const safeInfo = await safeService.getSafeInfo("0x6311999EDa3500fD06E2C1F1dFD92Bb19735dE88");
  const safeAddress = safeInfo.address;

  console.log("safeInfo:");
  console.log(safeInfo);

  let pendingTxs = (await safeService.getPendingTransactions(safeAddress)).results;

  console.log("pendingTxs:");
  console.log(pendingTxs);

  const safeSdkOwner1 = await Safe.create({
    ethAdapter: ethAdapterOwner1,
    safeAddress: safeAddress,
  });

  console.log("safeSdkOwner1:");
  console.log(safeSdkOwner1);

  const spender = "0x399F5EE127ce7432E4921a61b8CF52b0af52cbfE"; //Request Network's fee proxy
  const ethAmount = ethers.utils.parseUnits("0.0", "ether").toString();

  const encodedDataApprove = tokenInterface.encodeFunctionData("approve", [spender, ethers.utils.parseEther("50.0")]);
  const encodedDataTransfer = feeProxyInterface.encodeFunctionData("transferFromWithReferenceAndFee", [
    "0x9A6D9c95951cE328Bd52174259e6B966E33E8bE6", //_tokenAddress //DAO Token
    "0x6D7e59211Fa846c020c0B44397587133FE95831d", //_to //receiver
    ethers.utils.parseEther("50.0"), //_amount //receiver
    "0x4ea1e62beb09735c", //_paymentReference
    ethers.utils.parseUnits("0.000000000000000001", "ether"), //_feeAmount
    "0x0000000000000000000000000000000000000000", //_feeAddress
  ]);
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

  const safeTransaction = await safeSdkOwner1.createTransaction({ safeTransactionData });
  const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash);
  console.log("safeTransaction:");
  console.log(safeTransaction);

  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: await owner1Signer.getAddress(),
    senderSignature: senderSignature.data,
  });

  pendingTxs = (await safeService.getPendingTransactions(safeAddress)).results;
  console.log("pendingTxs:");
  console.log(pendingTxs);
}

// Using this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
