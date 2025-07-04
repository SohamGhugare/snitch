import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/logo.png" alt="Snitch Logo" width={40} height={40} priority />
        <span className="text-2xl font-bold text-white">Snitch</span>
      </Link>
      <button className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors">
        Connect Github
      </button>
    </nav>
  );
} 