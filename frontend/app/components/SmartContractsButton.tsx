"use client";
import { useState } from "react";
import StepIndicator from "./StepIndicator";
import UploadScoreButton from "./UploadScoreButton";

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
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<SmartContractFile[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  // For demo, hardcode a repo. Replace with user input or prop as needed.
  const owner = "SohamGhugare";
  const repo = "snitch";

  const fetchContracts = async () => {
    setLoading(true);
    setError(null);
    setContracts([]);
    setSelectedContract("");
    setAuditReport("");
    setAuditError("");
    setShowAuditReport(false);
    setShowStepper(true);
    setSteps([
      { label: "Fetching Smart Contract contents", done: false, active: true },
      { label: "Auditing smart contract", done: false, active: false },
    ]);
    
    try {
      const res = await fetch(`/api/get-smart-contracts?owner=${owner}&repo=${repo}`);
      if (!res.ok) throw new Error("Failed to fetch smart contracts");
      const data: SmartContractFile[] = await res.json();
      setContracts(data);
      setSteps([
        { label: "Smart Contract contents fetched", done: true, active: false },
        { label: "Auditing smart contract", done: false, active: false },
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setShowStepper(false);
    } finally {
      setLoading(false);
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
        <button
          className="px-6 py-2 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-colors mb-4 font-mono"
          onClick={fetchContracts}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Smart Contracts"}
        </button>
        
        {error && (
          <div className="text-red-400 mb-2 font-mono">{error}</div>
        )}
        
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