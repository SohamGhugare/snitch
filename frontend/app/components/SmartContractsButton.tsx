"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SmartContractsButton() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!repoUrl) {
      toast.error("Please enter a GitHub repository URL", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
      return;
    }

    try {
      setIsLoading(true);
      // Extract owner and repo from URL
      const urlParts = repoUrl.split("/");
      const owner = urlParts[urlParts.length - 2];
      const repo = urlParts[urlParts.length - 1];

      if (!owner || !repo) {
        throw new Error("Invalid GitHub URL format");
      }

      // Navigate to audit page with repo info
      router.push(`/audit?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse GitHub URL", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-2xl overflow-y-auto">
      <div className="flex flex-col items-center w-full min-h-min pb-8">
        <div className="w-full max-w-xl mb-12">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter github repo url..."
                className="w-full px-4 py-2 bg-black/20 backdrop-blur-sm border border-white/20 
                         text-white font-mono placeholder:text-white/50
                         focus:outline-none focus:border-[#00ff9d] transition-colors"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="p-2 border border-white/20 hover:border-[#00ff9d] bg-black/20 backdrop-blur-sm
                       text-white hover:text-[#00ff9d] transition-colors group disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 