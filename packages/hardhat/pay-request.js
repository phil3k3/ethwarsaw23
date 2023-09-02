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
        hasErc20Approval,
        approveErc20,
        payRequest
     } = require("@requestnetwork/payment-processor");
     const { providers, Wallet, getDefaultProvider} = require("ethers");

  
    // Load environment variables from .env file
    config();
    console.log("Config loaded");
  
    const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
      method: Types.Signature.METHOD.ECDSA,
      privateKey: process.env.PAYER_PRIVATE_KEY, // Must include 0x prefix
    });

    const provider = getDefaultProvider("goerli");
  
    const payerWallet = new Wallet(
        process.env.PAYER_PRIVATE_KEY, // Must include 0x prefix
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
    console.log(requestData);
    const _hasSufficientFunds = await hasSufficientFunds(
        requestData,
        payerWallet.address,
        {
          provider: provider,
        },
      );

    if (_hasSufficientFunds) {
        console.log(requestData);
        console.log(payerWallet);

        console.log("Requesting approval");
        const _hasErc20Approval = await hasErc20Approval(
          requestData,
          payerWallet.address,
          provider
        );

        if (!_hasErc20Approval) {
          console.log('Requesting approval...');
          const approvalTx = await approveErc20(requestData, payerWallet);
          await approvalTx.wait(2);
          console.log(`Approval granted. ${approvalTx.hash}`);
        }

        const paymentTx = await payRequest(requestData, payerWallet);
        await paymentTx.wait(2);
        console.log("Request paid...");

        const request = await requestClient.fromRequestId(requestData.requestId);
        let requestData2 = request.getData();
        console.log("Refreshed payment request");

        while (requestData2.balance?.balance < requestData2.expectedAmount) {
            console.log("Waiting for payment to be confirmed...");
            requestData = await request.refresh();
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // update payment request with correct amount
        // switch to payee wallet

        // get details from NFT (interest rate, etc..)

        // TODO burn NFT (using payee private key) ?
    }
    else {
        console.log("Insufficient funds");
    }
  })();