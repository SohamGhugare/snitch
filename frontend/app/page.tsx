import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SmartContractsButton from "./components/SmartContractsButton";

export default async function Home() {
  const user = await currentUser();
  console.log(user?.backupCodeEnabled);
  return (
    <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
      <h1 className="text-6xl font-bold text-white">Snitch</h1>
      <SmartContractsButton />
      <SignedIn>
      </SignedIn>
    </div>
  );
}
