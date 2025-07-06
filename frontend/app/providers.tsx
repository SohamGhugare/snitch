'use client';

import type React from 'react';
import { Toaster } from 'react-hot-toast';
import { FlowProvider } from '@onflow/kit';
import flowJson from '../flow.json';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FlowProvider 
      config={{
        accessNodeUrl: 'https://rest-testnet.onflow.org',
        flowNetwork: 'testnet',
        discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
        walletconnectProjectId: process.env.NEXT_WALLETCONNECT_PROJECT_ID,
      }}
      flowJson={flowJson}
    >
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#000',
            color: '#00ff9d',
            border: '1px solid #00ff9d',
            fontFamily: 'monospace',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#00ff9d',
              secondary: '#000',
            },
          },
        }}
      />
    </FlowProvider>
  );
}