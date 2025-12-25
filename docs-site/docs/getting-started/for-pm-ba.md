---
sidebar_position: 2
title: For PM/BA
---

# Getting Started for PM/BA

Create developer-ready specifications using Claude Code.

## Quick Start

```bash
# In Claude Code, run:
/write-spec <feature-name>
```

Claude will guide you through a conversation to create a complete spec.

## The Flow

1. **You run** `/write-spec user-export`
2. **Claude asks** questions one at a time
3. **Claude generates** `docs/user-export/spec.md`
4. **Developer runs** `/develop-feature user-export`
5. **Claude builds** the feature from your spec

## Spec Format

The generated spec includes:

```markdown
# Spec: feature-name

## Overview
One sentence: what this does.

## Requirements
- [ ] REQ-1: Description
- [ ] REQ-2: Description

## Data Model
(Mermaid ERD diagram)

## API
(Endpoints, request/response)

## Error Codes
(Error format and codes)

## Test Cases
(Input/expected output table)

## Out of Scope
(What we're NOT building)
```

## Example

See a complete example: [example-feature/spec.md](https://github.com/quochuydev/workflow/blob/main/examples/docs/example-feature/spec.md)

## Manual Creation

You can also create specs manually:

```
docs/
└── your-feature/
    ├── spec.md              # Required
    └── examples/            # Optional
        ├── valid-input.json
        └── invalid-input.json
```

## Tips

- **Be specific** - Vague specs lead to wrong implementations
- **Use `/write-spec`** - Let Claude guide you through all required sections
- **Include examples** - JSON examples prevent misunderstandings
- **Update docs first** - If requirements change, update spec before telling developers

## What Happens Next

1. You push docs to GitHub
2. GitHub Action notifies developers
3. Developer runs `/develop-feature your-feature`
4. Claude reads your docs and builds the feature
