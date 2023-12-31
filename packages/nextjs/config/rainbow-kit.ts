import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { argentWallet, ledgerWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig } from "wagmi";
import {
  arbitrum,
  avalanche,
  bsc,
  celo,
  fantom,
  gnosis,
  goerli,
  mainnet,
  moonbeam,
  optimism,
  polygon,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    {
      ...gnosis,
      iconUrl:
        "https://raw.githubusercontent.com/gnosischain/media-kit/main/Logos/01%20Chain/Background/SVG/LogomarkChain-Vertical-Cream_onMoss.svg",
    },
    polygon,
    optimism,
    arbitrum,
    avalanche,
    bsc,
    celo,
    fantom,
    moonbeam,
    goerli,
  ],
  [publicProvider()],
);

// Project ID from WalletConnect account:
const projectId = "152edacbf75e37f23d75d7dbde5fe298";

const appName = "PEERUPmvp1";

const { wallets } = getDefaultWallets({
  appName,
  projectId,
  chains,
});

export const demoAppInfo = {
  appName,
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
