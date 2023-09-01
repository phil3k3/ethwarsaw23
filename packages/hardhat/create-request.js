(async () => {
    const {
      RequestNetwork,
      Types,
      Utils,
    } = require("@requestnetwork/request-client.js");
    const {
      EthereumPrivateKeySignatureProvider,
    } = require("@requestnetwork/epk-signature");
    const { config } = require("dotenv");
    const { ethers, providers, Wallet, getDefaultProvider} = require("ethers"); 
    const WorkItem  = require("./artifacts/contracts/WorkItem.sol/WorkItemNFT.json");
  
    // // Load environment variables from .env file
    config();
    console.log("Config loaded");
  
    const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
      method: Types.Signature.METHOD.ECDSA,
      privateKey: process.env.PAYEE_PRIVATE_KEY, // Must include 0x prefix
    });
  
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://goerli.gateway.request.network/",
      },
      signatureProvider: epkSignatureProvider,
    });

    console.log("Request client created");
  
    // In this example, the payee is also the payer and payment recipient.
    const payeeIdentity = process.env.PAYEE_PUBLIC_KEY;
    const payerIdentity = payeeIdentity;
    const paymentRecipient = payeeIdentity;
    const feeRecipient = "0x0000000000000000000000000000000000000000";
  
    const requestCreateParameters = {
      requestInfo: {
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          value: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
          network: "goerli",
        },
        expectedAmount: "1000",
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payeeIdentity,
        },
        payer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payerIdentity,
        },
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: "goerli",
          paymentAddress: paymentRecipient,
          feeAddress: feeRecipient,
          feeAmount: "0",
        },
      },
      contentData: {
        reason: "🍕",
        dueDate: "2023.10.25",
      },
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
    };
  
    const request = await requestClient.createRequest(requestCreateParameters);
    const requestData = await request.waitForConfirmation();
    console.log(JSON.stringify(requestData, null, 2));

    const provider = getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(process.env.PAYEE_PRIVATE_KEY, provider);
    const erc721Mintable = new ethers.Contract(
        process.env.NFT_ADDRESS,
        WorkItem.abi,
        wallet
    );

    const txResponse = erc721Mintable.mint(process.env.PAYEE_PUBLIC_KEY, "myGitHash", request.requestId, 1000, 3);
    const receipt = await txResponse;
    console.log("NFT minted in block:", receipt.blockNumber);
  })();