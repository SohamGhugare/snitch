"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import UploadScoreButton from "../components/UploadScoreButton";

interface SmartContractFile {
  path: string;
  content: string;
}

interface Step {
  label: string;
  status: 'pending' | 'loading' | 'completed';
}

// const SYSTEM_PROMPT = `You are an expert smart contract auditor and performance optimizer. You will receive a smart contract's source code and your job is to perform a **deep technical audit** and **suggest optimal improvements** across multiple dimensions. If the provided code is not a solidty or cadence smart contract, you should return "This is not a valid smart contract. We currently only support solidty and cadence smart contracts.".

// Go through the code carefully and generate a detailed, structured report with findings and fixes for each of the following categories:

// ### 1. **Access Control**
// - Are functions properly protected using onlyOwner, onlyAdmin, or role-based restrictions?
// - Is there a risk of unauthorized access?
// - Are upgrade or configuration functions adequately restricted?

// ### 2. **Gas and Storage Optimization**
// - Are there any loops over dynamic storage arrays?
// - Can calldata be used instead of memory?
// - Are expensive operations minimized or batched?
// - Are uint256 variables packed efficiently where applicable?
// - Are mappings or structs used correctly to reduce slot usage?

// ### 3. **Logic Integrity and Bugs**
// - Is the business logic sound and aligned with the intended protocol behavior?
// - Any reentrancy risks?
// - Any edge cases or scenarios that can break the contract?
// - Look for unhandled underflows/overflows (especially if using older Solidity).

// ### 4. **Security Vulnerabilities**
// - Are there any known vulnerabilities (e.g., front-running, flash loan attack surfaces, denial of service via unexpected revert)?
// - Check for issues like timestamp dependency, tx.origin authentication, and delegatecall misuse.

// ### 5. **Upgradeability and Proxy Compatibility**
// - If upgradeable, are storage layouts handled properly?
// - Are initializers used instead of constructors?  

// ---

// **Output Format:**  (Do not use emojis)
// Generate your response in a structured audit report format with the following sections per finding:
// - **Finding Type**: [Optimization / Security / Style / Gas / Logic]
// - **Severity**: [High / Medium / Low / Informational]
// - **Description**: A short summary of the issue
// - **Explanation**: Why it's a problem and potential impact
// - **Recommendation**: How to fix or improve it
// - **Code Reference**: Line numbers or code snippets involved

// ---

// At the end of the report, calculate and display a final audit score out of 100 points with the below format.

// Audit Score: 85`;

const SYSTEM_PROMPT = `You are a world-class smart contract auditor. Your task is to deeply analyze the following smart contract code written in {{LANGUAGE}} (either Solidity .sol or Cadence .cdc).

Perform a thorough audit and produce a well-structured, professional report that includes:

Executive Summary
A concise overview of the contract's purpose and major findings.

Vulnerabilities
List all detected security vulnerabilities, categorizing them as Critical, High, Medium, Low, or Informational.
For each issue:

Include the line number(s) and a code snippet from the contract

Explain why it is a problem

Propose a fix or mitigation

Gas & Storage Optimizations (Solidity) / Resource Optimization (Cadence)
Suggest optimizations that reduce gas costs, improve storage efficiency, or optimize resource handling.

Code Quality & Best Practices
Identify any violations of language-specific best practices, redundant code, improper naming, or logic flaws.

Access Control & Authorization Checks
Analyze the access control model. Ensure proper use of onlyOwner, access(all), admin, etc., and validate all privileged functions.

Test Coverage & Upgradeability Notes (if applicable)
Comment on missing test coverage, and whether the contract is upgradeable (e.g., via proxies, contracts using delegatecall, or Flow upgrade mechanisms).

Overall Code Design Assessment
Highlight the strengths and potential long-term maintainability concerns.

At the end of the report, append a final audit score (on a scale of 0–100)
Format it like this:
Audit Score: XX`;

export default function AuditPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  
  const [selectedContract, setSelectedContract] = useState('');
  const [contracts, setContracts] = useState<SmartContractFile[]>([]);
  const [auditReport, setAuditReport] = useState('');
  const [showAuditReport, setShowAuditReport] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState<Step[]>([
    { label: "Fetching smart contract contents", status: 'pending' },
    { label: "Generating audit report", status: 'pending' }
  ]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!owner || !repo) {
        setAuditError('Missing repository information');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setAuditError('');
      try {
        const response = await fetch(`/api/get-smart-contracts?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch contracts');
        }
        const data = await response.json();
        
        // The API returns an array of contracts directly
        if (Array.isArray(data)) {
          setContracts(data);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
        setAuditError(error instanceof Error ? error.message : 'Failed to read repository contents');
        setContracts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [owner, repo]);

  const getContractNameFromPath = (path: string) => {
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  };

  const handleAudit = async () => {
    if (!selectedContract) return;
    
    setAuditLoading(true);
    setAuditError('');
    setShowAuditReport(false);
    setSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));

    try {
      // Update first step status
      setSteps(steps => steps.map((step, i) => 
        i === 0 ? { ...step, status: 'loading' } : step
      ));

      // Simulate delay for first step
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Complete first step and start second
      setSteps(steps => steps.map((step, i) => 
        i === 0 ? { ...step, status: 'completed' } : 
        i === 1 ? { ...step, status: 'loading' } : step
      ));

      const contract = contracts.find(c => c.path === selectedContract);
      if (!contract) {
        throw new Error('Selected contract not found');
      }

      // Make API call to audit endpoint
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract: contract.content,
          systemPrompt: SYSTEM_PROMPT
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audit report');
      }

      if (!data.auditReport) {
        throw new Error('No audit report received');
      }

      setAuditReport(data.auditReport);

      // Complete second step
      setSteps(steps => steps.map(step => ({ ...step, status: 'completed' })));

    } catch (error) {
      console.error('Error during audit:', error);
      setAuditError(error instanceof Error ? error.message : 'Failed to generate audit report');
      setSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white/80 font-mono p-8 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-2xl text-green-400 font-bold">_audit.sh</h1>
          <span className="text-sm text-white/50">
            {owner || ''}/{repo || ''}
          </span>
        </div>

        {!owner || !repo ? (
          <div className="text-center text-white/70">
            <p>Invalid repository information</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 mt-24">
            <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            <div className="flex items-center gap-2">
              <span className="text-white/30">{">_"}</span>
              <span className="text-white/70">reading the repo... please wait</span>
            </div>
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center text-white/70">
            <p>No smart contracts found in this repository.</p>
          </div>
        ) : (
          <>
            {/* Contract Selection */}
            <div className="flex items-center gap-4 mb-12">
              <select
                className="flex-1 px-4 py-3 bg-black/50 border border-white/20 text-white/80 
                         focus:outline-none focus:border-green-400 rounded-none
                         hover:border-white/40 transition-colors"
                value={selectedContract}
                onChange={e => setSelectedContract(e.target.value)}
              >
                <option value="" className="text-white/50">select_contract</option>
                {contracts.map((file) => (
                  <option key={file.path} value={file.path} className="text-white">
                    {file.path}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAudit}
                disabled={!selectedContract || auditLoading}
                className={`
                  px-6 py-3 border border-green-400/50 text-green-400 hover:bg-green-400/10
                  transition-colors whitespace-nowrap font-semibold
                  ${(!selectedContract || auditLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                run_audit
              </button>
            </div>

            {/* Steps */}
            {(steps[0].status !== 'pending' || steps[1].status !== 'pending') && (
              <div className="space-y-3 mb-12">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span className="text-white/30">{">_"}</span>
                    {step.status === 'loading' ? (
                      <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : step.status === 'completed' ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                    )}
                    <span className="text-white/70">{step.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* View Report Button */}
            {auditReport && steps[1].status === 'completed' && !showAuditReport && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAuditReport(true)}
                  className="px-6 py-3 bg-green-400/10 border border-green-400/50 
                           text-green-400 hover:bg-green-400/20 transition-colors 
                           flex items-center gap-3 font-semibold"
                >
                  <span className="text-white/30">{">_"}</span>
                  View Report
                </button>
              </div>
            )}

            {/* Audit Report */}
            {showAuditReport && auditReport && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white/30">{">_"}</span>
                    <h2 className="text-green-400">audit_report.md</h2>
                  </div>
                  <UploadScoreButton 
                    auditReport={auditReport} 
                    repoOwner={owner || ""}
                    contractName={getContractNameFromPath(selectedContract)}
                  />
                </div>
                <pre className="overflow-x-auto text-sm text-white/90 whitespace-pre-wrap 
                             bg-white/5 p-6 border border-white/10 rounded shadow-lg">
                  {auditReport}
                </pre>
              </div>
            )}
          </>
        )}

        {auditError && (
          <div className="mt-6 text-center text-red-400/90">{auditError}</div>
        )}
      </div>
    </div>
  );
} 