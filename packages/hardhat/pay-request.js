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
    const { 
        hasSufficientFunds,  
        approveErc20,
        hasErc20Approval,
        payRequest
     } = require("@requestnetwork/payment-processor");
     const { providers, Wallet, getDefaultProvider} = require("ethers");

  
    // Load environment variables from .env file
    config();
    console.log("Config loaded");
  
    const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
      method: Types.Signature.METHOD.ECDSA,
      privateKey: process.env.PAYEE_PRIVATE_KEY, // Must include 0x prefix
    });

    const provider = getDefaultProvider("goerli");
  
    const payerWallet = new Wallet(
        process.env.PAYEE_PRIVATE_KEY, // Must include 0x prefix
        provider,
    );

    // log the wallets balance
    const balance = await payerWallet.getBalance();
    console.log("Wallet balance: " + balance.toString());

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://goerli.gateway.request.network/",
      },
      signatureProvider: epkSignatureProvider,
    });

    console.log("Request client created");
    const request = await requestClient.fromRequestId(process.argv[2]);
    const requestData = request.getData();  
    const _hasSufficientFunds = await hasSufficientFunds(
        requestData,
        payerWallet.address,
        {
          provider: provider,
        },
      );

    if (_hasSufficientFunds) {
        // const _hasErc20Approval = await hasErc20Approval(
        //     requestData,
        //     payerWallet.address,
        //     provider
        // );
        // if (!_hasErc20Approval) {
        //     const approvalTx = await approveErc20(requestData, payerWallet);
        //     await approvalTx.wait(2);
        // }

        const paymentTx = await payRequest(requestData, payerWallet);
        await paymentTx.wait(2);

        const request = await requestClient.fromRequestId(requestData.requestId);
        let requestData2 = request.getData();

        while (requestData2.balance?.balance < requestData2.expectedAmount) {
            console.log("Waiting for payment to be confirmed...");
            requestData = await request.refresh();
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // TODO burn NFT
    }
    else {
        console.log("Insufficient funds");
    }
  })();