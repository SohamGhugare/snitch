"use client";

import { useEffect, useState } from "react";
import {
  useFlowMutate,
  useFlowTransactionStatus,
  useFlowCurrentUser,
} from "@onflow/kit";
import toast from 'react-hot-toast';
import { pinata } from "@/app/utils/config";

interface UploadScoreButtonProps {
  auditReport: string;
  repoOwner: string;
  contractName: string;
}

export default function UploadScoreButton({ auditReport, repoOwner, contractName }: UploadScoreButtonProps) {
  const { user } = useFlowCurrentUser();
  const [showTxId, setShowTxId] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reportCid, setReportCid] = useState<string>('');
  
  const {
    mutate: uploadAudit,
    isPending: txPending,
    data: txId,
    error: txError,
  } = useFlowMutate();

  const { transactionStatus, error: txStatusError } = useFlowTransactionStatus({
    id: txId || "",
  });

  // Monitor transaction status
  useEffect(() => {
    if (txId && transactionStatus?.status === 3) {
      toast.success("Audit score uploaded successfully!", {
        icon: '🚀',
        style: {
          background: '#000',
          color: '#00ff9d',
          border: '1px solid #00ff9d',
          fontFamily: 'monospace',
        },
      });
      setShowTxId(true);
    }
  }, [transactionStatus?.status, txId]);

  const uploadToPinata = async () => {
    try {
      setUploading(true);
      
      // Convert audit report to markdown file
      const mdContent = `# Smart Contract Audit Report\n\n${auditReport}`;
      const mdFile = new File([mdContent], 'audit-report.md', { type: 'text/markdown' });

      // Get upload URL from our API
      const urlRequest = await fetch("/api/url");
      const urlResponse = await urlRequest.json();
      
      if (urlResponse.error) {
        throw new Error(urlResponse.error);
      }

      // Upload to Pinata
      const upload = await pinata.upload.public
        .file(mdFile)
        .url(urlResponse.url);


      if (!upload?.cid) {
        throw new Error('Failed to get IPFS hash from Pinata');
      }

      setReportCid(upload.cid);
      return upload.cid;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      toast.error("Failed to upload audit report", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!user?.loggedIn) {
      toast.error("Please connect your wallet first", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
      return;
    }

    if (!repoOwner || !contractName) {
      toast.error("Contract information is missing", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
      return;
    }

    // Extract score from the audit report
    const scoreMatch = auditReport.match(/Audit Score: (\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    if (!score) {
      toast.error("Could not find audit score in the report", {
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
      // First upload to Pinata
      const cid = await uploadToPinata();

      console.log("cid", cid);

      // Then upload to Flow
      uploadAudit({
        cadence: `
          import AuditRegistry from 0xd61e4386e551be09

          transaction {
              prepare(acct: &Account) {
                  // Authorization handled via wallet
              }

              execute {
                  // Add audit to the audit registry
                  let auditId: UInt16 = ${Date.now() % 65535} // Generate unique ID from timestamp
                  let auditScore: Int8 = ${score}
                  AuditRegistry.addAudit(
                    _contract: "${repoOwner}:${contractName}",
                    _id: auditId,
                    _score: auditScore,
                    _timestamp: ${Math.floor(Date.now() / 1000)},
                    _auditor: ${user.addr},
                    _reportHash: "${cid}"
                  )

                  // Get and log the updated audits
                  let audits = AuditRegistry.getAudit(_contract: "${repoOwner}:${contractName}")
                  if let audits = audits {
                      for audit in audits {
                          log("Audit ID: ".concat(audit.id.toString()))
                          log("Score: ".concat(audit.score.toString()))
                          log("Timestamp: ".concat(audit.timestamp.toString()))
                          log("Auditor: ".concat(audit.auditor.toString()))
                          log("Report Hash: ".concat(audit.reportHash))
                          log("---")
                      }
                  }
              }
          }
        `,
      });
    } catch (error) {
      console.error("Error uploading score:", error);
      toast.error("Failed to upload score", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
    }
  };

  // Handle transaction errors
  useEffect(() => {
    if (txError) {
      console.error("Transaction error:", txError);
      toast.error(`Transaction error: ${txError.message}`, {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
    }
  }, [txError]);

  // Handle transaction status errors
  useEffect(() => {
    if (txStatusError) {
      console.error("Transaction status error:", txStatusError);
      toast.error(`Status error: ${txStatusError.message}`, {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
    }
  }, [txStatusError]);

  return (
    <div className="flex items-center gap-3">
      {!showTxId && (
        <button
          onClick={handleUpload}
          disabled={txPending || uploading}
          className={`
            px-6 py-2 border-2 border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black 
            transition-all duration-300 font-mono flex items-center gap-2
            bg-black/20 backdrop-blur-sm
            ${(txPending || uploading) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${txPending || uploading ? 'animate-spin' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {txPending || uploading ? (
              // Loading spinner icon
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            ) : (
              // Upload icon
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            )}
          </svg>
          {uploading ? 'Uploading to IPFS...' : txPending ? 'Uploading to Flow...' : 'Upload Score'}
        </button>
      )}
      {showTxId && txId && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/30">{">_"}</span>
          <span className="text-white/70 font-mono">tx:</span>
          <a 
            href={`https://testnet.flowscan.io/tx/${txId}?tab=events`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors font-mono"
          >
            {txId.slice(0, 8)}...{txId.slice(-6)}
          </a>
          {reportCid && (
            <>
              <span className="text-white/30 ml-2">{">_"}</span>
              <span className="text-white/70 font-mono">ipfs:</span>
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${reportCid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors font-mono"
              >
                {reportCid.slice(0, 8)}...{reportCid.slice(-6)}
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
} 