"use client";
import { useState } from "react";

interface SmartContractFile {
  path: string;
  content: string;
}

const SYSTEM_PROMPT = `You are an expert smart contract auditor and performance optimizer. You will receive a smart contract's source code and your job is to perform a **deep technical audit** and **suggest optimal improvements** across multiple dimensions.

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
- **Code Reference**: Line numbers or code snippets involved`;

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
  const [stepsStatus, setStepsStatus] = useState([
    { label: "Fetching Smart Contract contents", done: false },
    { label: "Auditing...", done: false },
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
    setStepsStatus([
      { label: "Fetching Smart Contract contents", done: false },
      { label: "Auditing...", done: false },
    ]);
    try {
      // Step 1: Fetch file list and contents
      const res = await fetch(`/api/get-smart-contracts?owner=${owner}&repo=${repo}`);
      if (!res.ok) throw new Error("Failed to fetch smart contracts");
      const data: SmartContractFile[] = await res.json();
      setContracts(data);
      setStepsStatus([
        { label: "Fetched Smart Contract contents", done: true },
        { label: "Auditing...", done: false },
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
    setStepsStatus([
      { label: "Fetched Smart Contract contents", done: true },
      { label: "Auditing...", done: false },
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
      setStepsStatus([
        { label: "Fetched Smart Contract contents", done: true },
        { label: "Audit report generated.", done: true },
      ]);
    } catch (err: unknown) {
      setAuditError(err instanceof Error ? err.message : String(err));
      setStepsStatus([
        { label: "Fetched Smart Contract contents", done: true },
        { label: "Auditing failed", done: false },
      ]);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-2xl">
      <button
        className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors mb-4"
        onClick={fetchContracts}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Smart Contracts"}
      </button>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {contracts.length > 0 && (
        <div className="flex flex-col items-center w-full">
          <select
            className="px-4 py-2 border border-white bg-black text-white mb-4 w-70"
            value={selectedContract}
            onChange={e => setSelectedContract(e.target.value)}
          >
            <option value="" disabled>Select a smart contract</option>
            {contracts.map((file) => (
              <option key={file.path} value={file.path}>{file.path.split('/').pop()}</option>
            ))}
          </select>
          <button
            className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors"
            onClick={handleAudit}
            disabled={!selectedContract || auditLoading}
          >
            {auditLoading ? "Auditing..." : "Audit"}
          </button>
        </div>
      )}
      {/* Stepper UI */}
      {showStepper && (
        <div className="w-full mt-6">
          {stepsStatus.map((stepObj, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${stepObj.done ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className={stepObj.done ? 'text-green-400' : 'text-white'}>{stepObj.label}</span>
            </div>
          ))}
        </div>
      )}
      {/* View Audit Report Button */}
      {stepsStatus[1].done && auditReport && (
        <button
          className="mt-6 px-6 py-2 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-colors"
          onClick={() => setShowAuditReport((v) => !v)}
        >
          {showAuditReport ? "Hide Audit Report" : "View Audit Report"}
        </button>
      )}
      {/* Audit Report Display */}
      {showAuditReport && auditReport && (
        <div className="w-full mt-6 p-4 bg-gray-800 rounded border border-green-500">
          <h2 className="text-xl font-bold text-green-400 mb-2">Audit Report</h2>
          <pre className="overflow-x-auto text-sm text-white bg-black p-2 rounded whitespace-pre-wrap">
            {auditReport}
          </pre>
        </div>
      )}
      {auditError && (
        <div className="w-full mt-6 text-center text-red-400">{auditError}</div>
      )}
    </div>
  );
} 