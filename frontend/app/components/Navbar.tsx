"use client";

import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import { WalletConnectButton } from './WalletConnectButton';
import { useEffect } from 'react';
import * as fcl from '@onflow/fcl';

export default function Navbar() {
  useEffect(() => {
    fcl.config(
      {
        "accessNode.api": "https://rest-testnet.onflow.org",
        "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
        "flow.network": "testnet"
      }
    )
  }, []);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-[#00ff9d]/10">
      <div className="flex justify-between items-center px-6 py-4 mx-auto">
        <Link href="/" className="flex items-center gap-1 group">
          <div className="relative">
            <Image 
              src="/logo.png" 
              alt="Snitch Logo" 
              width={40} 
              height={40} 
              priority 
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-[#00ff9d]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-2xl font-bold text-white/90 font-mono">Snitch</span>
        </Link>
        <div className="flex items-center gap-4">
          <WalletConnectButton />
          <SignedOut>
            <SignInButton oauthFlow="popup" mode="modal">
              <button className="px-6 py-2 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors font-mono">
                Connect Github
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
} 