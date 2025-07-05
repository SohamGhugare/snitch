access(all)
contract AuditRegistry {

    // Event to be emitted when an audit is added
    access(all) event AuditAdded(_contract: Address, _score: Int8)

    // Audit struct
    access(all)
    struct Audit {
        access(all) var score: Int8
        access(all) var timestamp: Int64
        access(all) var auditor: Address
        access(all) var reportHash: String

        init(_score: Int8, _timestamp: Int64, _auditor: Address, _reportHash: String) {
            self.score = _score
            self.timestamp = _timestamp
            self.auditor = _auditor
            self.reportHash = _reportHash
        }
    }

    access(all) var audits: {Address: Audit}

    init() {
        self.audits = {}
    }

    // Add audit to the audit registry
    access(all) fun addAudit(_contract: Address, _score: Int8, _timestamp: Int64, _auditor: Address, _reportHash: String) {
        let audit = Audit(_score: _score, _timestamp: _timestamp, _auditor: _auditor, _reportHash: _reportHash)
        self.audits[_contract] = audit
        emit AuditAdded(_contract: _contract, _score: _score)
    }

    // Get audit from the audit registry
    access(all) fun getAudit(_contract: Address): Audit? {
        return self.audits[_contract]
    }
}