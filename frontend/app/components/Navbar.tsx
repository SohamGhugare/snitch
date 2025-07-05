"use client";

import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export default function Navbar() {
  const handleConnectWallet = () => {
    // TODO: Implement wallet connection
    alert("Wallet connection coming soon!");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/logo.png" alt="Snitch Logo" width={40} height={40} priority />
        <span className="text-2xl font-bold text-white">Snitch</span>
      </Link>
      <div className="flex items-center gap-4">
        <button
          onClick={handleConnectWallet}
          className="px-6 py-2 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-colors font-mono"
        >
          Connect Wallet
        </button>
        <SignedOut>
          <SignInButton oauthFlow="popup" mode="modal">
            <button className="px-6 py-2 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-colors font-mono">
              Connect Github
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
} 