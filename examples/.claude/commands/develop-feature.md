---
name: develop-feature
description: Build a feature using docs as source of truth
arguments:
  - name: feature
    description: Feature folder name in ./docs/
    required: true
---

# Develop Feature: $ARGUMENTS.feature

You are developing a feature based on documentation in `./docs/$ARGUMENTS.feature/`.

## Step 1: Read All Documentation

Read these files in order (skip if not found):

1. `./docs/$ARGUMENTS.feature/spec.md` - **Required**: What to build
2. `./docs/$ARGUMENTS.feature/rules.md` - Business logic rules
3. All files in `./docs/$ARGUMENTS.feature/examples/` - Example data
4. `./docs/$ARGUMENTS.feature/test-cases/cases.md` - Test scenarios

If `spec.md` does not exist, STOP and tell the user:
> "No spec.md found for feature '$ARGUMENTS.feature'. Please create ./docs/$ARGUMENTS.feature/spec.md first."

## Step 2: Analyze Feature Size

Based on documentation:

| Indicator | Size | Approach |
|-----------|------|----------|
| Only spec.md, simple requirements | Small | Implement directly |
| Multiple files, several rules | Medium | Create task list, implement sequentially |
| Sub-folders, cross-feature dependencies | Large | Create implementation plan first |

## Step 3: Find Related Code

Search for existing code related to this feature:
- Look for files/folders matching the feature name
- Check imports and references
- Identify files that will need modification

## Step 4: Create Implementation Plan

Based on size:

**Small:** List 3-5 implementation steps

**Medium:** Create detailed task list with:
- Files to create/modify
- Order of implementation
- Validation checkpoints

**Large:** Write full implementation plan to `docs/plans/` before coding

## Step 5: Implement with Validation

For each task:
1. Implement the code
2. Validate against spec.md requirements
3. Validate against rules.md (if exists)
4. Check example data handling (if exists)

## Step 6: Final Checklist

Before marking complete:
- [ ] All acceptance criteria from spec.md met
- [ ] All business rules from rules.md implemented
- [ ] Example inputs produce expected outputs
- [ ] No hardcoded values that should come from docs
- [ ] Code matches documented behavior exactly

## Important Rules

- **Docs are source of truth** - If unclear, ask user to update docs
- **Don't assume** - If spec doesn't say it, ask before implementing
- **Validate constantly** - Check work against docs at every step
