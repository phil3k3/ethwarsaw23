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
  
    // Load environment variables from .env file
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

    const identity = process.env.PAYEE_PUBLIC_KEY;
    const requests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: identity,
      });
      const requestDatas = requests.map((request) => request.getData());
      console.log(JSON.stringify(requestDatas, null, 2));

      requests.forEach((request) => {
        console.log("node pay-request.js " + request.requestId);
      });
  })();