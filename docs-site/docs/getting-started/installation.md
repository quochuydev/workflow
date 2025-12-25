---
sidebar_position: 0
title: Installation
---

# Installation

Set up the AI Team Workflow in your project.

## Quick Start

```bash
npx create-ai-team
```

This will:
1. Ask for your project folder name
2. Let you select which components to install
3. Create the folder structure

## What Gets Installed

```
your-project/
├── .claude/
│   └── commands/
│       ├── write-spec.md      # PM/BA: Create specs via conversation
│       ├── develop-feature.md # Dev: Build from specs
│       ├── fix-issue.md       # Dev: Fix bugs with context
│       └── trace-flow.md      # Dev: Trace code flow
├── .github/
│   └── workflows/             # Optional: GitHub Actions
└── docs/
    └── example-feature/       # Optional: Example spec
        └── spec.md
```

## Options

| Component | Description |
|-----------|-------------|
| Claude Code commands | `/write-spec`, `/develop-feature`, `/fix-issue`, `/trace-flow` |
| GitHub Actions | Doc change notifications, n8n triggers |
| Example feature doc | Sample `spec.md` to learn the format |

## Update Existing Install

```bash
npx create-ai-team --update
```

This backs up existing files and updates to latest templates.

## Example Repository

See a working example: [github.com/quochuydev/workflow/tree/main/examples](https://github.com/quochuydev/workflow/tree/main/examples)

## Next Steps

| Role | Next |
|------|------|
| **PM/BA** | [Getting Started for PM/BA](/getting-started/for-pm-ba) |
| **Developer** | [Getting Started for Developers](/getting-started/for-developers) |
