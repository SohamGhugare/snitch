import SmartContractsButton from "./components/SmartContractsButton";
import SearchAudits from "./components/SearchAudits";
import { SignedIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* Hero Section */}
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center relative bg-[#00110a] border-b border-[#00ff9d]/20">
        {/* Matrix-like scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,_rgba(0,_255,_157,_0.025)_50%)] bg-[length:100%_20px]" />
        
        <div className="flex flex-col items-center justify-center p-8 z-10">
          {/* Terminal window effect */}
          <div className="max-w-4xl w-full bg-black/80 backdrop-blur-sm border border-[#00ff9d]/30 rounded-lg p-8 shadow-[0_0_50px_rgba(0,255,157,0.1)] terminal-window">
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="ml-4 text-white/50 text-sm font-mono">~/snitch/audit</div>
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
              
              <div className="pt-8">
                <SmartContractsButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-4xl p-8">
        <SearchAudits />
        <SignedIn>
        </SignedIn>
      </div>
    </main>
  );
}
