import "AuditRegistry"

access(all)
fun main(): AuditRegistry.Audit?{
    let audit = AuditRegistry.getAudit(_contract: 0xf8d6e0586b0a20c7)

    return audit ?? AuditRegistry.Audit(_score: 0, _timestamp: 0, _auditor: 0x00, _reportHash: "")
}