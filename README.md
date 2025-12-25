# Documentation Guide

This folder contains feature documentation that serves as the source of truth for development.

## Folder Structure

Each feature gets its own folder:

```
docs/
└── <feature-name>/
    ├── spec.md          # Required: What to build
    ├── rules.md         # Optional: Business logic rules
    ├── examples/        # Optional: Example data
    │   ├── input-1.json
    │   └── output-1.json
    └── test-cases/      # Optional: Test scenarios
        └── cases.md
```

## Writing spec.md

Every feature needs a `spec.md` with:

1. **Overview** - What this feature does (1-2 sentences)
2. **User Story** - As a [user], I want [goal], so that [benefit]
3. **Acceptance Criteria** - Checklist of requirements
4. **UI/UX** - Screens, flows, or interactions (if applicable)
5. **API** - Endpoints, request/response (if applicable)

## Writing rules.md

For features with complex business logic, add `rules.md`:

1. **Validation Rules** - Input validation requirements
2. **Business Rules** - Logic, calculations, conditions
3. **Edge Cases** - How to handle unusual scenarios
4. **Error Handling** - Error messages and recovery

## Adding Examples

Put example data in `examples/` folder:
- Use JSON format for machine-readability
- Name files descriptively: `valid-purchase.json`, `invalid-negative-amount.json`
- Include both valid and invalid examples

## Naming Conventions

- Feature folder names: lowercase, hyphenated (e.g., `user-auth`, `payment-flow`)
- Use the folder name when referencing features in commands
