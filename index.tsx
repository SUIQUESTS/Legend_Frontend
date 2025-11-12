import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import "./src/responsive.css";
import { Theme } from "@radix-ui/themes";


const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    devnet: { url: getFullnodeUrl('devnet') },
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
});

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* <Theme name="dark"> */}
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
              <WalletProvider autoConnect>
                  <App />
              </WalletProvider>
          </SuiClientProvider>
      </QueryClientProvider>
      {/* </Theme> */}
   </React.StrictMode>
);