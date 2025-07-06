"use client";
import { useState } from "react";
import StepIndicator from "./StepIndicator";
import UploadScoreButton from "./UploadScoreButton";
import toast from "react-hot-toast";

interface SmartContractFile {
  path: string;
  content: string;
}

const SYSTEM_PROMPT = `You are an expert smart contract auditor and performance optimizer. You will receive a smart contract's source code and your job is to perform a **deep technical audit** and **suggest optimal improvements** across multiple dimensions. If the provided code is not a solidty or cadence smart contract, you should return "This is not a valid smart contract. We currently only support solidty and cadence smart contracts.".

Go through the code carefully and generate a detailed, structured report with findings and fixes for each of the following categories:

### 1. **Access Control**
- Are functions properly protected using onlyOwner, onlyAdmin, or role-based restrictions?
- Is there a risk of unauthorized access?
- Are upgrade or configuration functions adequately restricted?

### 2. **Gas and Storage Optimization**
- Are there any loops over dynamic storage arrays?
- Can calldata be used instead of memory?
- Are expensive operations minimized or batched?
- Are uint256 variables packed efficiently where applicable?
- Are mappings or structs used correctly to reduce slot usage?

### 3. **Logic Integrity and Bugs**
- Is the business logic sound and aligned with the intended protocol behavior?
- Any reentrancy risks?
- Any edge cases or scenarios that can break the contract?
- Look for unhandled underflows/overflows (especially if using older Solidity).

### 4. **Security Vulnerabilities**
- Are there any known vulnerabilities (e.g., front-running, flash loan attack surfaces, denial of service via unexpected revert)?
- Check for issues like timestamp dependency, tx.origin authentication, and delegatecall misuse.

### 5. **Upgradeability and Proxy Compatibility**
- If upgradeable, are storage layouts handled properly?
- Are initializers used instead of constructors?  

---

**Output Format:**  (Do not use emojis)
Generate your response in a structured audit report format with the following sections per finding:
- **Finding Type**: [Optimization / Security / Style / Gas / Logic]
- **Severity**: [High / Medium / Low / Informational]
- **Description**: A short summary of the issue
- **Explanation**: Why it's a problem and potential impact
- **Recommendation**: How to fix or improve it
- **Code Reference**: Line numbers or code snippets involved

---

At the end of the report, calculate and display a final audit score out of 100 points with the below format.

Audit Score: 85`;

export default function SmartContractsButton() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<SmartContractFile[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditReport, setAuditReport] = useState<string>("");
  const [auditError, setAuditError] = useState<string>("");
  const [showAuditReport, setShowAuditReport] = useState(false);
  const [showStepper, setShowStepper] = useState(false);
  const [steps, setSteps] = useState([
    { label: "Fetching Smart Contract contents", done: false, active: false },
    { label: "Auditing smart contract", done: false, active: false },
  ]);

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

      const response = await fetch(`/api/get-smart-contracts?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch smart contracts");
      }

      const data = await response.json();
      toast.success("Smart contracts fetched successfully!", {
        style: {
          background: '#000',
          color: '#00ff9d',
          border: '1px solid #00ff9d',
          fontFamily: 'monospace',
        },
      });

      setContracts(data);
      setSelectedContract("");
      setAuditReport("");
      setAuditError("");
      setShowAuditReport(false);
      setShowStepper(true);
      setSteps([
        { label: "Smart Contract contents fetched", done: true, active: false },
        { label: "Auditing smart contract", done: false, active: false },
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch smart contracts", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudit = async () => {
    if (!selectedContract) return;
    setAuditLoading(true);
    setAuditReport("");
    setAuditError("");
    setShowAuditReport(false);
    setSteps([
      { label: "Smart Contract contents fetched", done: true, active: false },
      { label: "Auditing smart contract", done: false, active: true },
    ]);

    try {
      const contract = contracts.find((c) => c.path === selectedContract);
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract: contract?.content, systemPrompt: SYSTEM_PROMPT }),
      });
      if (!res.ok) throw new Error("Failed to audit contract");
      const data: { auditReport: string } = await res.json();
      setAuditReport(data.auditReport);
      setSteps([
        { label: "Smart Contract contents fetched", done: true, active: false },
        { label: "Audit report generated", done: true, active: false },
      ]);
    } catch (err: unknown) {
      setAuditError(err instanceof Error ? err.message : String(err));
      setSteps([
        { label: "Smart Contract contents fetched", done: true, active: false },
        { label: "Auditing failed", done: false, active: false },
      ]);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-2xl  overflow-y-auto">
      <div className="flex flex-col items-center w-full min-h-min pb-8">
        <div className="w-full max-w-xl mb-12">
          <h2 className="text-2xl font-mono text-[#00ff9d] mb-4">New Audit</h2>
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
        
        {contracts.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <select
              className="px-4 py-2 border border-[#00ff9d] bg-black text-[#00ff9d] mb-4 w-70 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ff9d] focus:border-transparent"
              value={selectedContract}
              onChange={e => setSelectedContract(e.target.value)}
            >
              <option value="" disabled>Select a smart contract</option>
              {contracts.map((file) => (
                <option key={file.path} value={file.path}>{file.path.split('/').pop()}</option>
              ))}
            </select>
            <button
              className="px-6 py-2 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-colors font-mono"
              onClick={handleAudit}
              disabled={!selectedContract || auditLoading}
            >
              {auditLoading ? "Auditing..." : "Audit"}
            </button>
          </div>
        )}

        {/* Stepper UI */}
        {showStepper && (
          <div className="w-full mt-8">
            <StepIndicator steps={steps} />
          </div>
        )}

        {/* View Audit Report Button */}
        {steps[1].done && auditReport && (
          <button
            className="mt-8 px-6 py-2 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-colors font-mono"
            onClick={() => setShowAuditReport((v) => !v)}
          >
            {showAuditReport ? "Hide Audit Report" : "View Audit Report"}
          </button>
        )}

        {/* Audit Report Display */}
        {showAuditReport && auditReport && (
          <div className="w-full mt-6 p-4 bg-black/30 rounded border border-[#00ff9d] backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00ff9d] font-mono">Audit Report</h2>
              <UploadScoreButton auditReport={auditReport} />
            </div>
            <pre className="overflow-x-auto text-sm text-white bg-black/50 p-4 rounded font-mono whitespace-pre-wrap">
              {auditReport}
            </pre>
          </div>
        )}

        {auditError && (
          <div className="w-full mt-6 text-center text-red-400 font-mono">{auditError}</div>
        )}
      </div>
    </div>
  );
} 