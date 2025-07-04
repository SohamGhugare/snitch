export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-white">
      <div className="text-2xl font-bold text-white">Snitch</div>
      <button className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors">
        Connect Github
      </button>
    </nav>
  );
} 