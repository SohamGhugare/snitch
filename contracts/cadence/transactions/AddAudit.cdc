import "AuditRegistry"

transaction {
    prepare(acct: &Account) {
        // Authorizes the transaction
    }

    execute {
        // Add audit to the audit registry
        let auditId: UInt16 = 1
        let auditScore: Int8 = 85
        AuditRegistry.addAudit(_contract: 0xf8d6e0586b0a20c3, _id: auditId, _score: auditScore, _timestamp: 1714953600, _auditor: 0x01, _reportHash: "0x12345")

        // Get audit from the audit registry
        let audits = AuditRegistry.getAudit(_contract: 0xf8d6e0586b0a20c3)

        if let audits = audits {
            for audit in audits {
                log("Audit ID: ".concat(audit.id.toString()))
                log("Score: ".concat(audit.score.toString()))
                log("Timestamp: ".concat(audit.timestamp.toString()))
                log("Auditor: ".concat(audit.auditor.toString()))
                log("Report Hash: ".concat(audit.reportHash))
                log("---")
            }
        } else {
            log("No audits found for this contract")
        }
    }
}