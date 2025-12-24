---
sidebar_position: 2
title: For PM/BA
---

# Getting Started for PM/BA

Write specs that developers and Claude can understand.

## Your Role

1. Create feature documentation in `docs/<feature-name>/`
2. Push to GitHub
3. Developers get notified and use your docs as source of truth

## Folder Structure

Each feature needs its own folder:

```
docs/
└── user-auth/              # Feature folder (lowercase, hyphenated)
    ├── spec.md             # Required: What to build
    ├── rules.md            # Optional: Business logic
    └── examples/           # Optional: Sample data
        ├── valid-login.json
        └── invalid-login.json
```

## Writing spec.md

Every feature **must** have a `spec.md` with:

```markdown
# Feature Name

## Overview
One sentence describing what this feature does.

## User Story
As a [user type], I want [goal], so that [benefit].

## Acceptance Criteria
- [ ] User can do X
- [ ] System validates Y
- [ ] Error shown when Z

## API (if applicable)
### POST /api/endpoint
Request: { ... }
Response: { ... }
```

## Writing rules.md

For complex business logic:

```markdown
# Feature Name - Business Rules

## Validation Rules
1. Field X must be Y
2. Maximum Z allowed

## Business Rules
1. When A happens, do B
2. Calculate C as D * E

## Edge Cases
| Scenario | Expected Behavior |
|----------|-------------------|
| Empty input | Show error "Required" |
```

## Adding Examples

Put JSON examples in `examples/` folder:

- `valid-purchase.json` - Example of valid data
- `invalid-negative-amount.json` - Example of invalid data

## What Happens Next

1. You push docs to GitHub
2. GitHub Action notifies developers
3. Developer runs `/develop-feature your-feature`
4. Claude reads your docs and builds the feature
5. Tests run automatically via n8n

## Tips

- **Be specific** - Vague specs lead to wrong implementations
- **Use checklists** - Acceptance criteria as checkboxes are easy to verify
- **Include examples** - JSON examples prevent misunderstandings
- **Update docs first** - If requirements change, update spec before telling developers
