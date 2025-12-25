---
sidebar_position: 1
title: For Developers
---

# Getting Started for Developers

Build features from specs using Claude Code commands.

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- Access to this repository

## Workflow

### 1. Get notified of new specs

When PM/BA creates or updates `docs/<feature>/spec.md`, you'll get a notification (Slack/PR comment).

### 2. Develop the feature

```bash
# In Claude Code, run:
/develop-feature <feature-name>
```

This command:
- Reads `docs/<feature>/spec.md` (required)
- Reads example data in `docs/<feature>/examples/`
- Creates an implementation plan
- Builds the feature step-by-step

### 3. Fix issues

```bash
/fix-issue "user cannot login after password reset"
```

Or with a GitHub issue link:

```bash
/fix-issue https://github.com/quochuydev/workflow/issues/123
```

### 4. Understand code flow

```bash
/trace-flow handleLogin
```

This traces the code path and shows related business rules from docs.

## Available Commands

| Command | Purpose |
|---------|---------|
| `/develop-feature <name>` | Build feature from spec |
| `/fix-issue <desc>` | Fix bug with doc context |
| `/trace-flow <target>` | Trace code with business rules |

## Example

See a working example: [github.com/quochuydev/workflow/tree/main/examples](https://github.com/quochuydev/workflow/tree/main/examples)

## Tips

- **Always check docs first** - If something is unclear, ask PM/BA to update the spec
- **Validate against docs** - After building, verify your code matches all acceptance criteria
- **Don't assume** - If the spec doesn't say it, ask before implementing
