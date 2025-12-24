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
        A[Write spec.md] --> B[Push to GitHub]
    end

    subgraph GitHub
        B --> C{GitHub Action}
        C -->|doc change| D[Notify Developers]
        C -->|any push| E[Trigger n8n]
    end

    subgraph Developer
        D --> F[Receive notification]
        F --> G[Run /develop-feature]
        G --> H[Claude reads docs]
        H --> I[Implement feature]
        I --> J[Push code]
    end

    subgraph QC
        E --> K[n8n receives webhook]
        K --> L[Run automated tests]
        L --> M[Report results]
    end

    J --> C
```

## Documentation Structure

```mermaid
flowchart LR
    subgraph docs/
        direction TB
        README[README.md]
        
        subgraph feature/
            SPEC[spec.md]
            RULES[rules.md]
            subgraph examples/
                EX1[valid.json]
                EX2[invalid.json]
            end
        end
    end

    SPEC -->|required| Claude[Claude Code]
    RULES -->|optional| Claude
    EX1 -->|optional| Claude
    EX2 -->|optional| Claude
```

## Command Flow: /develop-feature

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Claude as Claude Code
    participant Docs as docs/<feature>/
    participant Code as Codebase

    Dev->>Claude: /develop-feature user-auth
    Claude->>Docs: Read spec.md
    Docs-->>Claude: Feature requirements
    Claude->>Docs: Read rules.md (if exists)
    Docs-->>Claude: Business rules
    Claude->>Docs: Read examples/ (if exists)
    Docs-->>Claude: Sample data
    Claude->>Claude: Analyze & plan
    Claude->>Code: Implement feature
    Claude->>Dev: Report completion
```

## Command Flow: /fix-issue

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

    PUSH -->|docs/** changed| DOC
    PR -->|docs/** changed| DOC
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
| `docs/<feature>/spec.md` | PM/BA | Define what to build |
| `docs/<feature>/rules.md` | PM/BA | Define business logic |
| `.claude/commands/*.md` | DevOps | Define Claude commands |
| `.github/workflows/*.yml` | DevOps | Automation workflows |
