import "AuditRegistry"

access(all)
fun main(): [AuditRegistry.Audit]? {
    let audits = AuditRegistry.getAudit(_contract: "SohamGhugare:snitch")

    if let audits = audits {
        log("Audits: ".concat(audits[0].id.toString()))
    } else {
        log("No audits found")
    }
    
    return audits
}