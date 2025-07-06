"use client";

import { useState } from "react";
import { useFlowQuery } from "@onflow/kit";
import toast from 'react-hot-toast';

interface Audit {
  id: number;
  score: number;
  timestamp: number;
  auditor: string;
  reportHash: string;
}

interface SearchAuditsProps {
  placeholder?: string;
}

export default function SearchAudits({ placeholder = "Enter contract address..." }: SearchAuditsProps) {
  const [contractAddress, setContractAddress] = useState("");
  const [searchInitiated, setSearchInitiated] = useState(false);

  const { data: audits, isLoading, error, refetch } = useFlowQuery({
    cadence: `
      import AuditRegistry from 0x2655b0e78244c4fa

      access(all)
      fun main(): [AuditRegistry.Audit]? {
          let audits = AuditRegistry.getAudit(_contract: ${contractAddress || "0x0"})
          return audits
      }
    `,
    query: { enabled: searchInitiated },
  });

  const auditResults = audits as Audit[] | undefined;

  const handleSearch = () => {
    if (!contractAddress) {
      toast.error("Please enter a contract address", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
      return;
    }
    setSearchInitiated(true);
    refetch();
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 bg-black/20 backdrop-blur-sm border border-white/20 
                       text-white font-mono placeholder:text-white/50
                       focus:outline-none focus:border-[#00ff9d] transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
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

        {error && (
          <div className="p-4 border border-red-500 bg-black/20 backdrop-blur-sm text-red-400 font-mono">
            Error: {error.message}
          </div>
        )}

        {searchInitiated && !isLoading && !error && (
          <div className="border border-[#00ff9d] bg-black/20 backdrop-blur-sm p-4">
            {auditResults && auditResults.length > 0 ? (
              <div className="space-y-4">
                {auditResults.map((audit: Audit, index: number) => (
                  <div key={index} className="font-mono text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#00ff9d]">Audit #{index + 1}</span>
                      <span className="text-white/70">(ID: {audit.id})</span>
                      <span className="px-2 py-1 bg-[#00ff9d]/10 text-[#00ff9d] text-sm">
                        Score: {audit.score}
                      </span>
                    </div>
                    <div className="text-sm text-white/70 space-y-1">
                      <p>Auditor: {audit.auditor}</p>
                      <p>Date: {new Date(audit.timestamp * 1000).toLocaleDateString()}</p>
                      <p className="font-mono text-xs">Report Hash: {audit.reportHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-mono">No audits found for this contract.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 