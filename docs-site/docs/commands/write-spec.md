---
sidebar_position: 0
title: "/write-spec"
description: "Create feature specification through conversation"
---

# /write-spec

> Create feature specification through conversation (for PM/BA)

## Usage

```
/write-spec <feature>
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `feature` | Feature folder name in ./docs/ | Yes |

## What This Command Does

Guides PM/BA through a conversation to create a developer-ready specification.

## Step 1: Understand the Problem

Starts by asking:
> "What problem does **feature** solve? Why is it needed now?"

Then explores:
- Who is the user?
- What's the expected outcome?
- Any existing solutions or workarounds?

## Step 2: Gather Requirements

Asks about each, one at a time:

1. **Core functionality** - What must it do?
2. **Data** - What data is involved? What are the fields?
3. **API** (if applicable) - What endpoints? Request/response?
4. **UI** (if applicable) - What screens? What interactions?
5. **States** - Does data have states/transitions?
6. **Errors** - What can go wrong? How to handle?
7. **Constraints** - Performance, security, dependencies?
8. **Out of scope** - What are we NOT building?

## Step 3: Confirm Understanding

Before generating, summarizes and asks if anything is missing.

## Step 4: Generate Spec

Creates `./docs/<feature>/spec.md` with:

- Overview
- Requirements (checklist)
- Data Model (Mermaid ERD)
- API endpoints (if applicable)
- Error format and codes
- State diagram (if applicable)
- Dependencies & constraints
- Test cases
- Out of scope

## Step 5: Review & Save

Shows the spec, asks for changes, then saves.

## Output

Creates `./docs/<feature>/spec.md` ready for `/develop-feature`.

## Workflow

```
PM/BA: /write-spec user-export     → creates docs/user-export/spec.md
Dev:   /develop-feature user-export → builds from spec
```

---

*Auto-generated from [`.claude/commands/write-spec.md`](https://github.com/quochuydev/workflow/blob/main/.claude/commands/write-spec.md)*
