import "AuditRegistry"

transaction {
    prepare(acct: &Account) {
        // Authorizes the transaction
    }

    execute {
        // Add audit to the audit registry
        AuditRegistry.addAudit(_contract: 0xf8d6e0586b0a20c7, _score: 96, _timestamp: 1714953600, _auditor: 0x01, _reportHash: "0x12345")

        // Get audit from the audit registry
        let audit = AuditRegistry.getAudit(_contract: 0xf8d6e0586b0a20c7)

        log("Audit score: ".concat(audit?.score?.toString() ?? "0"))
        log("Audit timestamp: ".concat(audit?.timestamp?.toString() ?? "0"))
        log("Audit auditor: ".concat(audit?.auditor?.toString() ?? "0"))
        log("Audit report hash: ".concat(audit?.reportHash ?? "0"))
    }
}