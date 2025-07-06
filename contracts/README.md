# Snitch Smart Contracts

This directory contains the Cadence smart contracts and transactions for the Snitch platform, a decentralized audit registry system built on Flow blockchain.

## Contracts

### AuditRegistry.cdc

The `AuditRegistry` contract serves as the core component of the Snitch platform, managing and storing audit records for smart contracts.

#### Key Features:
- **Audit Storage**: Maintains a mapping of contract identifiers to their respective audit records
- **Event Emission**: Emits events when new audits are added for tracking and indexing
- **Public Access**: All functions and structures are publicly accessible

#### Structures:

##### Audit
```cadence
struct Audit {
    var id: UInt16
    var score: Int8
    var timestamp: Int64
    var auditor: Address
    var reportHash: String
}
```

#### Functions:

##### `addAudit`
```cadence
fun addAudit(
    _contract: String,
    _id: UInt16,
    _score: Int8,
    _timestamp: Int64,
    _auditor: Address,
    _reportHash: String
)
```
Adds a new audit record to the registry for a specific contract.

##### `getAudit`
```cadence
fun getAudit(_contract: String): [Audit]?
```
Retrieves all audit records for a given contract.

## Transactions

### AddAudit.cdc

A transaction that demonstrates how to add an audit record to the registry.

#### Features:
- Imports the `AuditRegistry` contract
- Adds a sample audit record with the following details:
  - Contract: "SohamGhugare:snitch"
  - ID: 2
  - Score: 96
  - Timestamp: 1714953600
  - Auditor: 0x01
  - Report Hash: "0x78907"
- Retrieves and logs the added audit record

## Scripts

### GetAudit.cdc

A script to retrieve audit records for a specific contract.

#### Features:
- Imports the `AuditRegistry` contract
- Returns an array of `Audit` records for the specified contract
- Includes logging for debugging purposes

## Usage

1. Deploy the contracts:
   ```bash
   flow project deploy
   ```

2. Add an audit record:
   ```bash
   flow transactions send ./cadence/transactions/AddAudit.cdc
   ```

3. Query audit records:
   ```bash
   flow scripts execute ./cadence/scripts/GetAudit.cdc
   ```

## Events

### AuditRegistry Events
- `AuditAdded(_contract: String, _id: UInt16, _score: Int8)`: Emitted when a new audit is added

