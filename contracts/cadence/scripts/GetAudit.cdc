import "AuditRegistry"

access(all)
fun main(): [AuditRegistry.Audit]? {
    let audits = AuditRegistry.getAudit(_contract: 0xf8d6e0586b0a20c3)

    if let audits = audits {
        log("Audits: ".concat(audits[0].id.toString()))
    } else {
        log("No audits found")
    }
    
    return audits
}