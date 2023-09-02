//"use client";
import { useState } from "react";
import { currencies } from "../../config/currency";
import { storageChains } from "../../config/storage-chain";
//import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { parseUnits, zeroAddress } from "viem";
import { useAccount, useWalletClient } from "wagmi";

//import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

enum APP_STATUS {
  AWAITING_INPUT = "awaiting input",
  SUBMITTING = "submitting",
  PERSISTING_TO_IPFS = "persisting to ipfs",
  PERSISTING_ON_CHAIN = "persisting on-chain",
  REQUEST_CONFIRMED = "request confirmed",
  ERROR_OCCURRED = "error occurred",
}

export default function SubmitForm() {
  const [storageChain, setStorageChain] = useState("5");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [currency, setCurrency] = useState("5_0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc");
  //const [paymentRecipient, setPaymentRecipient] = useState("");
  const [payerIdentity, setPayerIdentity] = useState("");
  const [dueDate /*setDueDate*/] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(APP_STATUS.AWAITING_INPUT);

  const { data: walletClient, isError, isLoading } = useWalletClient();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [requestData, setRequestData] = useState<Types.IRequestDataWithEvents>();

  async function createRequest() {
    const signatureProvider = new Web3SignatureProvider(walletClient);
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(storageChain)!.gateway,
      },
      signatureProvider,
      // httpConfig: {
      //   getConfirmationMaxRetry: 40, // timeout after 120 seconds
      // },
    });
    const requestCreateParameters: Types.ICreateRequestParameters = {
      requestInfo: {
        currency: {
          type: currencies.get(currency)!.type,
          value: currencies.get(currency)!.value,
          network: currencies.get(currency)!.network,
        },
        expectedAmount: parseUnits(expectedAmount as `${number}`, currencies.get(currency)!.decimals).toString(),
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address as string,
        },
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: currencies.get(currency)!.network,
          paymentAddress: /*paymentRecipient || */ address,
          feeAddress: zeroAddress,
          feeAmount: "0",
        },
      },
      contentData: {
        // Consider using rnf_invoice format from @requestnetwork/data-format package.
        reason: reason,
        dueDate: dueDate,
      },
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address as string,
      },
    };

    if (payerIdentity.length > 0) {
      requestCreateParameters.requestInfo.payer = {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      };
    }

    try {
      setStatus(APP_STATUS.PERSISTING_TO_IPFS);
      const request = await requestClient.createRequest(requestCreateParameters);

      setStatus(APP_STATUS.PERSISTING_ON_CHAIN);
      setRequestData(request.getData());
      const confirmedRequestData = await request.waitForConfirmation();

      setStatus(APP_STATUS.REQUEST_CONFIRMED);
      setRequestData(confirmedRequestData);
    } catch (err) {
      setStatus(APP_STATUS.ERROR_OCCURRED);
      alert(err);
    }
  }

  function canSubmit() {
    return (
      status !== APP_STATUS.SUBMITTING &&
      !isDisconnected &&
      !isConnecting &&
      !isError &&
      !isLoading &&
      storageChain.length > 0 &&
      // Payment Recipient is empty || isAddress
      //(paymentRecipient.length === 0 || (paymentRecipient.startsWith("0x") && paymentRecipient.length === 42)) &&
      // Payer is empty || isAddress
      (payerIdentity.length === 0 || (payerIdentity.startsWith("0x") && payerIdentity.length === 42)) &&
      expectedAmount.length > 0 &&
      currency.length > 0
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit()) {
      return;
    }
    setRequestData(undefined);
    setStatus(APP_STATUS.SUBMITTING);
    createRequest();
  }

  function handleClear() {
    setRequestData(undefined);
    setStatus(APP_STATUS.AWAITING_INPUT);
  }

  return (
    <div>
      <h3>Create a request</h3>
      <br></br>
      <form onSubmit={handleSubmit} name="submiitform">
        <label>Payee Identity *</label>
        {/* <RainbowKitCustomConnectButton />
        <FaucetButton /> */}
        <p>
          The identity address of the Payee. Creating a request requires a signature from either the Payee Identity or
          Payer Identity. This demo only supports signing with the Payee Identity.
        </p>
        <br></br>
        <label>
          Storage Chain *
          <div>
            <select name="storage-chain" onChange={e => setStorageChain(e.target.value)} defaultValue={storageChain}>
              {Array.from(storageChains.entries()).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name} ({value.type})
                </option>
              ))}
            </select>
            <p>
              A hash of the request contents (IPFS CID) is stored on the Storage Chain regardless of the selected
              Currency and Payment Chain.
            </p>
          </div>
        </label>
        <br></br>
        <label>
          Amount *
          <div>
            <input type="number" name="expected-amount" step="any" onChange={e => setExpectedAmount(e.target.value)} />
            <p>
              The requested amount in human-readable units. This demo uses viem&apos;s parseUnits function to convert to
              EVM-compatible units, respecting the token&apos;s decimals.
            </p>
          </div>
        </label>
        <br></br>
        <label>
          Currency *
          <div>
            <select name="currency" onChange={e => setCurrency(e.target.value)} defaultValue={currency}>
              {Array.from(currencies.entries()).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.symbol} ({value.network})
                </option>
              ))}
            </select>
            <p>The requested currency. This determines the Payment Chain.</p>
          </div>
        </label>
        {/* <br></br>
        <label>
          Payment Recipient
          <div>
            <input
              type="text"
              name="payment-recipient"
              placeholder={address}
              onChange={e => setPaymentRecipient(e.target.value)}
              className={styles.h9_w96}
            />
            <p className={styles.text_sm}>
              The address that will receive the payment. If not specfied, defaults to the Payee Identity.
            </p>
          </div>
        </label> */}
        <br></br>
        <label>
          Payer Identity
          <div>
            <input
              type="text"
              name="payer-identity"
              placeholder="0x..."
              onChange={e => setPayerIdentity(e.target.value)}
            />
            <p>
              The identity address of the Payer. The Payer will see this request the next time they query requests
              associated with their identity. A request without a Payer Identity can be paid by any identity but
              requires an out-of-band notification to notify the Payer.
            </p>
          </div>
        </label>
        <br></br>
        {/* <label>
          Due Date
          <div>
            <input type="date" name="due-date" onChange={e => setDueDate(e.target.value)} className={styles.h9_w96} />
          </div>
          <p className={styles.text_sm}>
            The date by which the request should be paid. Due Date is stored in the contentData of the request. For a
            standardized invoice schema, consider using rnf_invoice format from @requestnetwork/data-format
          </p>
        </label> */}
        <br></br>
        <label>
          Reason
          <div>
            <input type="text" name="reason" onChange={e => setReason(e.target.value)} />
          </div>
          <p>
            The reason for the request. Reason is stored in the contentData of the request. For a standardized invoice
            schema, consider using rnf_invoice format from @requestnetwork/data-format
          </p>
        </label>
        <br></br>
        <button type="submit" disabled={!canSubmit()}>
          Submit
        </button>
      </form>
      <br></br>
      <div>
        <h3>Created request</h3>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
        <p>App status: {status}</p>
        <p>Request state: {requestData?.state}</p>
        <p>Request data:</p>
        <pre>{JSON.stringify(requestData, undefined, 2)}</pre>
      </div>
    </div>
  );
}
