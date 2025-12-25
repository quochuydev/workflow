# AI Team Workflow

A documentation-driven development workflow connecting PM/BA, Developers, and QC through Claude Code.

## Quick Start

```bash
npx create-ai-team
```

## How It Works

```
PM/BA: /write-spec user-export     → creates docs/user-export/spec.md
Dev:   /develop-feature user-export → builds from spec
```

## Commands

| Command | For | Purpose |
|---------|-----|---------|
| `/write-spec` | PM/BA | Create spec through conversation |
| `/develop-feature` | Dev | Build feature from spec |
| `/fix-issue` | Dev | Fix bugs with doc context |
| `/trace-flow` | Dev | Trace code flow |

## Folder Structure

```
your-project/
├── .claude/commands/      # Claude Code commands
├── docs/
│   └── <feature>/
│       ├── spec.md        # Required: What to build
│       └── examples/      # Optional: Sample data
└── .github/workflows/     # Optional: GitHub Actions
```

## Documentation

- [Full Documentation](https://quochuydev.github.io/workflow/)
- [Installation Guide](https://quochuydev.github.io/workflow/getting-started/installation)
- [Example Project](./examples)

## Spec Format

See [examples/docs/example-feature/spec.md](./examples/docs/example-feature/spec.md) for the full template.

Key sections:
- Overview
- Requirements (checklist)
- Data Model (Mermaid ERD)
- API endpoints
- Error format and codes
- Test cases
- Out of scope
