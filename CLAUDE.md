## Rules

### Sync Rules

When updating `./packages/create-ai-team`, **must sync to all locations**:

| Source | Sync To |
|--------|---------|
| `templates/.claude/commands/*.md` | `examples/.claude/commands/` |
| `templates/docs/example-feature/` | `examples/docs/example-feature/` |
| `templates/.claude/commands/*.md` | `docs-site/docs/commands/*.md` |
| `lib/copy.js` (FILE_MAPPINGS) | Ensure all templates listed |
| `lib/prompts.js` (description) | Update command list in prompt |

### When Adding a New Command

1. Create `templates/.claude/commands/<command>.md`
2. Add to `lib/copy.js` FILE_MAPPINGS.claudeCommands
3. Update `lib/prompts.js` description text
4. Sync to `examples/.claude/commands/`
5. Create `docs-site/docs/commands/<command>.md`
6. Update `docs-site/docs/commands/_index.md`
7. Update `docs-site/docs/intro.md` commands table
8. Update `docs-site/docs/workflow/overview.md` diagrams
9. Update `docs-site/docs/getting-started/` if role-specific
10. Update root `README.md` commands table
11. Update root `CLAUDE.md` commands table

### When Updating Spec Template

1. Update `templates/docs/example-feature/spec.md`
2. Sync to `examples/docs/example-feature/spec.md`
3. Update `docs-site/docs/getting-started/for-pm-ba.md` format section
4. Update `docs-site/docs/workflow/overview.md` if structure changed

### Spec Format Rules

- All feature specs go in `docs/<feature>/spec.md`
- **No separate `rules.md`** - business rules are in spec.md
- Use Mermaid ERD for data models
- Use Mermaid stateDiagram for state transitions
- Error format: `{ "code": "ERROR_CODE", "message": "...", "details": [] }`
- `details` is optional - hints for error recovery

### Mermaid Diagrams

All diagrams in `docs-site/` must reflect current state:
- `intro.md` - high-level flow with current commands
- `workflow/overview.md` - all command sequence diagrams
- No references to removed features (e.g., rules.md)

### Commands

| Command | For | Purpose |
|---------|-----|---------|
| `/write-spec` | PM/BA | Create spec through conversation |
| `/develop-feature` | Dev | Build feature from spec |
| `/fix-issue` | Dev | Fix bugs with doc context |
| `/trace-flow` | Dev | Trace code flow |

### Project Structure

```
workflow/
├── packages/create-ai-team/   # NPM package (source of truth)
│   ├── templates/             # Template files
│   ├── lib/                   # CLI code
│   └── bin/                   # CLI entry point
├── examples/                  # Synced from templates (for testing)
├── docs-site/                 # Docusaurus documentation
├── docs/plans/                # Design documents
├── README.md                  # Project overview
└── CLAUDE.md                  # Rules for Claude (this file)
```

### Git Commits

- Do NOT include `Co-Authored-By` or `🤖 Generated with Claude Code` in commit messages
- Keep commits attributed to the user only

### Checklist Before Commit

- [ ] All templates synced to examples/
- [ ] All commands documented in docs-site/
- [ ] Mermaid diagrams up to date
- [ ] README.md reflects current state
- [ ] No references to removed features
