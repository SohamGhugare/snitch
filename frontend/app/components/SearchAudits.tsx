"use client";

export default function SearchAudits() {
  return (
    <div className="w-full max-w-xl mb-12">
      <h2 className="text-2xl font-mono text-[#00ff9d] mb-4">Search Audits</h2>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter contract address..."
            className="w-full px-4 py-2 bg-black/20 backdrop-blur-sm border border-white/20 
                     text-white font-mono placeholder:text-white/50
                     focus:outline-none focus:border-[#00ff9d] transition-colors"
          />
        </div>
        <button
          className="p-2 border border-white/20 hover:border-[#00ff9d] bg-black/20 backdrop-blur-sm
                   text-white hover:text-[#00ff9d] transition-colors group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 