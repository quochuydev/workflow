# Team Workflow Design

## Overview

A GitHub-centric workflow system for a team of 2 PM/BA, 1 QC, and multiple fullstack developers. Solves document sync, task handoff, QC automation, and developer tooling problems.

## Problems Addressed

| Problem | Solution |
|---------|----------|
| Sync - Devs miss doc updates | GitHub Action notifications |
| Handoff - No clear task translation | Claude commands read docs directly |
| QC - Manual testing | n8n automation with visual workflows |
| Dev tooling - Inconsistent Claude usage | Shared commands for all developers |
| Design sync | Parked for v2 |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ./docs/                     .claude/                            │
│  ├── feature-a/              ├── settings.json                   │
│  │   ├── spec.md             ├── commands/                       │
│  │   ├── rules.md            │   ├── develop-feature.md          │
│  │   └── examples/           │   ├── fix-issue.md                │
│  └── feature-b/              │   └── trace-flow.md               │
│                                                                  │
│  .github/workflows/                                              │
│  ├── doc-change-notify.yml   ← Detects doc changes, notifies    │
│  └── trigger-n8n.yml         ← Webhooks to n8n for QC           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │      n8n (external)      │
                    │  - Test triggering       │
                    │  - Data setup            │
                    │  - API validation        │
                    └──────────────────────────┘
```

## Source of Truth

| Layer | Source of Truth | Owner |
|-------|-----------------|-------|
| Requirements | `./docs/feature-x/spec.md` | PM/BA |
| Business Rules | `./docs/feature-x/rules.md` | PM/BA |
| Implementation | Code in repo | Developer |
| Test Cases | n8n workflows + `./docs/feature-x/test-cases/` | QC |

**Rule:** Docs always win. If code doesn't match docs, code is wrong (or PM needs to update docs).

## Feature Size/Scope

| Size | Characteristics | Workflow |
|------|-----------------|----------|
| Small | Single file, 1-2 rules | Direct implementation |
| Medium | Multiple files, several rules | Break into tasks, implement sequentially |
| Large | Cross-feature, complex flows | Create implementation plan first, chunk into PRs |

**Detection based on doc structure:**
- 1 spec file = small
- Multiple files + examples = medium
- Sub-folders + dependencies = large

## Component 1: Doc Change Notification

### Flow

```
PM/BA pushes to ./docs/feature-x/
            │
            ▼
┌─────────────────────────────────┐
│  GitHub Action triggers         │
│  doc-change-notify.yml          │
└─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Detects which features changed │
│  - feature-x/spec.md (modified) │
│  - feature-x/rules.md (new)     │
└─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Notifies team:                 │
│  - Slack message with summary   │
│  - PR comment if in a PR        │
└─────────────────────────────────┘
```

### Notification Content

- Which feature changed
- What files changed (spec, rules, examples)
- Brief summary of changes
- Link to view diff

## Component 2: Claude Commands

### /develop-feature

Build new feature from docs.

**Steps:**
1. Reads `./docs/<feature-name>/` entirely
2. Identifies related code files (if existing feature)
3. Creates implementation plan based on feature size
4. Guides developer through building to spec
5. Validates against documented rules

**Usage:**
```bash
claude> /develop-feature feature-a
```

### /fix-issue

Fix bug with context from docs + code.

**Steps:**
1. Reads issue details
2. Finds related docs (searches `./docs/` for relevant feature)
3. Finds related code files
4. Proposes fix approach
5. Validates fix doesn't break documented rules

**Usage:**
```bash
claude> /fix-issue "balance shows wrong after purchase"
```

### /trace-flow

Understand complex flow across files.

**Steps:**
1. Starts from a function, endpoint, or file
2. Maps dependencies and call chain
3. Shows data flow with business context from docs
4. Useful for debugging and understanding complex features

**Usage:**
```bash
claude> /trace-flow purchase-balance
```

**Example output:**
```
1. ENTRY POINT FOUND:
   → POST /api/purchase (src/api/purchase.ts:45)

2. CALL CHAIN:
   /api/purchase
     → validatePurchase()      (src/services/validation.ts:23)
     → deductBalance()         (src/services/wallet.ts:87)
       → calculateFees()       (src/services/fees.ts:12)
       → updateUserBalance()   (src/db/queries/user.ts:156)
     → createTransaction()     (src/services/transaction.ts:34)

3. RELATED BUSINESS RULES (from ./docs/wallet/rules.md):
   - Balance cannot go negative
   - Fees apply to purchases > $100
   - Balance updates must be atomic

4. LIKELY ISSUE AREAS:
   - calculateFees() may not match rules.md fee logic
   - updateUserBalance() - check atomic transaction
```

## Component 3: n8n Integration

### GitHub to n8n Flow

```
Developer merges PR
        │
        ▼
┌─────────────────────────────┐
│  GitHub Action              │
│  trigger-n8n.yml            │
│  Sends webhook to n8n       │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  n8n receives webhook       │
│  Contains:                  │
│  - Changed files list       │
│  - Affected features        │
│  - PR/commit info           │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  n8n workflows:             │
│  1. Setup test data         │
│  2. Run API tests           │
│  3. Report results          │
└─────────────────────────────┘
```

### n8n Workflow Structure

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Webhook    │───▶│  Switch     │───▶│  Setup      │───▶│  HTTP       │
│  Trigger    │    │  (feature)  │    │  Test Data  │    │  Request    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
                                                        ┌─────────────┐
                                                        │  Compare    │
                                                        │  Response   │
                                                        └─────────────┘
                                                                │
                                                                ▼
                                                        ┌─────────────┐
                                                        │  IF         │
                                                        │  Pass/Fail  │
                                                        └─────────────┘
                                                         │         │
                                                    Pass ▼         ▼ Fail
                                                ┌─────────┐   ┌─────────┐
                                                │ Slack   │   │ Slack   │
                                                │ ✓ Pass  │   │ ✗ Fail  │
                                                └─────────┘   └─────────┘
```

### What Lives Where

| Location | Content |
|----------|---------|
| GitHub repo | Test data templates in `./docs/feature-x/test-data/` |
| n8n | Workflows that execute tests |
| n8n | API test definitions, data setup scripts |

## Folder Structure

```
your-repo/
├── .github/
│   └── workflows/
│       ├── doc-change-notify.yml    # Notifies on doc changes
│       └── trigger-n8n.yml          # Triggers QC tests
│
├── .claude/
│   ├── settings.json                # Claude Code config
│   └── commands/
│       ├── develop-feature.md       # /develop-feature command
│       ├── fix-issue.md             # /fix-issue command
│       └── trace-flow.md            # /trace-flow command
│
├── docs/
│   ├── README.md                    # How to write docs (for PM/BA)
│   └── <feature-name>/
│       ├── spec.md                  # What to build
│       ├── rules.md                 # Business logic rules
│       ├── examples/                # Example data
│       │   ├── input-1.json
│       │   └── output-1.json
│       └── test-cases/              # Test scenarios for QC
│           └── cases.md
│
└── src/                             # Your application code
```

### Conventions

| Rule | Why |
|------|-----|
| Feature folder name = feature ID | Easy to reference: `/develop-feature wallet` |
| `spec.md` required | Minimum doc for any feature |
| `rules.md` for complex logic | Keeps business rules separate from spec |
| `examples/` uses JSON | Machine-readable for tests |

## Not Included in v1 (YAGNI)

- Junior/Senior developer modes
- Auto-generated GitHub Issues from docs
- Complex notification rules
- Design sync workflow

## Implementation Order

1. Folder structure and conventions
2. Claude commands (`/develop-feature`, `/fix-issue`, `/trace-flow`)
3. GitHub Action: doc-change-notify
4. GitHub Action: trigger-n8n
5. n8n workflow templates
