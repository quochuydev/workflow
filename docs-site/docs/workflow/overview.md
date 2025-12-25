---
sidebar_position: 1
title: Workflow Overview
---

# Workflow Overview

This page visualizes the complete team workflow from documentation to deployment.

## High-Level Flow

```mermaid
flowchart TB
    subgraph PM/BA
        A[Run /write-spec] --> B[Claude generates spec.md]
        B --> C[Push to GitHub]
    end

    subgraph GitHub
        C --> D{GitHub Action}
        D -->|doc change| E[Notify Developers]
        D -->|any push| F[Trigger n8n]
    end

    subgraph Developer
        E --> G[Receive notification]
        G --> H[Run /develop-feature]
        H --> I[Claude reads spec.md]
        I --> J[Implement feature]
        J --> K[Push code]
    end

    subgraph QC
        F --> L[n8n receives webhook]
        L --> M[Run automated tests]
        M --> N[Report results]
    end

    K --> D
```

## Documentation Structure

```mermaid
flowchart LR
    subgraph docs/
        direction TB
        subgraph feature/
            SPEC[spec.md]
            subgraph examples/
                EX1[valid.json]
                EX2[invalid.json]
            end
        end
    end

    SPEC -->|required| Claude[Claude Code]
    EX1 -->|optional| Claude
    EX2 -->|optional| Claude
```

## Command Flow: /write-spec (PM/BA)

```mermaid
sequenceDiagram
    participant PM as PM/BA
    participant Claude as Claude Code
    participant Docs as docs/feature/

    PM->>Claude: /write-spec user-export
    Claude->>PM: What problem does this solve?
    PM->>Claude: Users need to export data
    Claude->>PM: What data fields?
    PM->>Claude: id, name, email, createdAt
    Claude->>PM: Any error cases?
    PM->>Claude: Invalid format, too large
    Claude->>Claude: Generate spec
    Claude->>Docs: Write spec.md
    Claude->>PM: Spec saved! Dev can run /develop-feature
```

## Command Flow: /develop-feature (Developer)

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Claude as Claude Code
    participant Docs as docs/feature/
    participant Code as Codebase

    Dev->>Claude: /develop-feature user-export
    Claude->>Docs: Read spec.md
    Docs-->>Claude: Requirements, API, errors
    Claude->>Docs: Read examples/ (if exists)
    Docs-->>Claude: Sample data
    Claude->>Claude: Analyze and plan
    Claude->>Code: Implement feature
    Claude->>Dev: Report completion
```

## Command Flow: /fix-issue (Developer)

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Claude as Claude Code
    participant Docs as docs/
    participant Code as Codebase

    Dev->>Claude: /fix-issue "login fails"
    Claude->>Code: Search for related code
    Claude->>Docs: Search for related specs
    Claude->>Claude: Compare code vs docs
    Claude->>Dev: Propose fix
    Dev->>Claude: Approve
    Claude->>Code: Apply fix
    Claude->>Dev: Report completion
```

## GitHub Actions Flow

```mermaid
flowchart LR
    subgraph Triggers
        PUSH[Push to main]
        PR[Pull Request]
    end

    subgraph Actions
        DOC[doc-change-notify]
        N8N[trigger-n8n]
    end

    subgraph Outputs
        SLACK[Slack notification]
        PRCOMMENT[PR comment]
        WEBHOOK[n8n webhook]
    end

    PUSH -->|docs/ changed| DOC
    PR -->|docs/ changed| DOC
    PUSH --> N8N
    PR --> N8N

    DOC --> SLACK
    DOC --> PRCOMMENT
    N8N --> WEBHOOK
```

## n8n Integration

```mermaid
flowchart LR
    GHA[GitHub Action] -->|webhook| N8N[n8n]

    N8N --> PARSE[Parse payload]
    PARSE --> ROUTE{Route by feature}

    ROUTE -->|feature-a| TESTA[Run Feature A tests]
    ROUTE -->|feature-b| TESTB[Run Feature B tests]
    ROUTE -->|unknown| DEFAULT[Run default tests]

    TESTA --> REPORT[Report results]
    TESTB --> REPORT
    DEFAULT --> REPORT

    REPORT --> SLACK[Slack]
    REPORT --> GH[GitHub Status]
```

## File Responsibilities

| File | Owner | Purpose |
|------|-------|---------|
| `docs/<feature>/spec.md` | PM/BA | Define what to build (via /write-spec) |
| `docs/<feature>/examples/` | PM/BA | Sample input/output data |
| `.claude/commands/*.md` | DevOps | Define Claude commands |
| `.github/workflows/*.yml` | DevOps | Automation workflows |
