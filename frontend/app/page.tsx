"use client";

import SmartContractsButton from "./components/SmartContractsButton";
import SearchAudits from "./components/SearchAudits";
import { SignedIn } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    searchSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* Full-page Hero Section */}
      <div className="w-full min-h-screen flex flex-col items-center relative bg-[#00110a]">
        {/* Matrix-like scanlines overlay */}
        <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,_rgba(0,_255,_157,_0.025)_50%)] bg-[length:100%_20px]" />
        
        {/* Content Container */}
        <div className="flex flex-col items-center w-full">
          {/* Main Terminal Section - Centered in viewport */}
          <div className="min-h-screen w-full flex items-center justify-center px-4 relative">
            <div className="w-full max-w-4xl bg-black/80 backdrop-blur-sm border border-[#00ff9d]/30 rounded-lg p-8 shadow-[0_0_50px_rgba(0,255,157,0.1)] terminal-window">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="ml-4 text-white/50 text-sm font-mono">~/snitch/new-audit</div>
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-8xl font-bold text-[#00ff9d] font-mono glitch-effect">
                    Snitch
                  </h1>
                  <p className="text-white/50 font-mono text-lg">
                    Snitching on insecure smart contracts since genesis
                  </p>
                </div>
                
                <div className="pt-2">
                  <SmartContractsButton />
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <button 
              onClick={scrollToSearch}
              className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 transition-transform hover:scale-105 cursor-pointer group"
            >
              <p className="text-[#00ff9d] font-mono text-lg group-hover:text-[#00ff9d]/80 transition-colors">
                Sniff out the logs. Trustlessly.
              </p>
              <ChevronDown 
                className="text-[#00ff9d] w-8 h-8 animate-bounce group-hover:text-[#00ff9d]/80 transition-colors" 
                strokeWidth={1.5} 
              />
            </button>
          </div>

          {/* Search Terminal Section - Below the fold */}
          <div id="search-section" className="min-h-screen w-full flex items-center justify-center px-4">
            <div className="w-full max-w-4xl bg-black/80 backdrop-blur-sm border border-[#00ff9d]/30 rounded-lg p-8 shadow-[0_0_50px_rgba(0,255,157,0.1)] terminal-window">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="ml-4 text-white/50 text-sm font-mono">~/snitch/search</div>
              </div>
              
              {/* Search Terminal Title */}
              <div className="space-y-2 mb-8">
                <h2 className="text-4xl font-bold text-[#00ff9d] font-mono">
                  Search Audit Logs
                </h2>
                <p className="text-white/50 font-mono">
                  No trust required
                </p>
              </div>
              
              <SearchAudits placeholder="Enter Contract ID" />
              <SignedIn>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
