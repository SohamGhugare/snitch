access(all)
contract AuditRegistry {

    // Event to be emitted when an audit is added
    access(all) event AuditAdded(_contract: String, _id: UInt16, _score: Int8)

    // Audit struct
    access(all)
    struct Audit {
        access(all) var id: UInt16
        access(all) var score: Int8
        access(all) var timestamp: Int64
        access(all) var auditor: Address
        access(all) var reportHash: String

        init(_id: UInt16, _score: Int8, _timestamp: Int64, _auditor: Address, _reportHash: String) {
            self.id = _id
            self.score = _score
            self.timestamp = _timestamp
            self.auditor = _auditor
            self.reportHash = _reportHash
        }
    }

    access(all) var audits: {String: [Audit]}

    init() {
        self.audits = {}
    }

    // Add audit to the audit registry
    access(all) fun addAudit(_contract: String, _id: UInt16, _score: Int8, _timestamp: Int64, _auditor: Address, _reportHash: String) {
        let audit = Audit(_id: _id, _score: _score, _timestamp: _timestamp, _auditor: _auditor, _reportHash: _reportHash)
        self.audits[_contract] = self.audits[_contract] ?? []
        self.audits[_contract]!.append(audit)
        emit AuditAdded(_contract: _contract, _id: _id, _score: _score)
    }

    // Get audit from the audit registry
    access(all) fun getAudit(_contract: String): [Audit]? {
        return self.audits[_contract]
    }
}