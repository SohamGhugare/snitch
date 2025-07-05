'use client';

import { useFlowCurrentUser } from '@onflow/kit';
import { useState } from 'react';

export const WalletConnectButton = () => {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser();
  const [showDisconnect, setShowDisconnect] = useState(false);

  if (!user?.loggedIn) {
    return (
      <button
        onClick={authenticate}
        type="button"
        className="px-6 py-2 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-colors font-mono"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDisconnect(!showDisconnect)}
        type="button"
        className="px-4 py-2 border border-[#00ff9d] text-[#00ff9d] bg-black/20 backdrop-blur-sm font-mono flex items-center gap-2 hover:bg-[#00ff9d]/10 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
        {user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}
      </button>
      
      {showDisconnect && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            unauthenticate();
            setShowDisconnect(false);
          }}
          type="button"
          className="absolute top-full left-0 mt-2 w-full px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors font-mono bg-black/20 backdrop-blur-sm"
        >
          Disconnect
        </button>
      )}
    </div>
  );
}; 