import SmartContractsButton from "./components/SmartContractsButton";
import SearchAudits from "./components/SearchAudits";
import { SignedIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-y-auto">
      <div className="flex flex-col items-center justify-center w-full p-8">
        <h1 className="text-8xl font-bold text-center text-[#00ff9d] mb-12 font-mono">
          Snitch
        </h1>
        <SearchAudits />
        <SmartContractsButton />
        <SignedIn>
        </SignedIn>
      </div>
    </main>
  );
}
