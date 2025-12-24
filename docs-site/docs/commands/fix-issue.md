---
sidebar_position: 2
title: "/fix-issue"
description: "Fix a bug with context from docs and code"
---

# /fix-issue

> Fix a bug with context from docs and code

## Usage

```
/fix-issue <issue>
```

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `issue` | Issue description or GitHub issue link | Yes |

## What This Command Does

# Fix Issue: $ARGUMENTS.issue

You are fixing an issue with full context from documentation and code.

## Step 1: Understand the Issue

Parse the issue:
- If GitHub link: Fetch issue details
- If description: Identify keywords and affected area

Issue: `$ARGUMENTS.issue`

## Step 2: Find Related Documentation

Search `./docs/` for related features:
1. Search for keywords from issue in all spec.md files
2. Search for keywords in all rules.md files
3. List all potentially related features

For each related feature found, read:
- `./docs/<feature>/spec.md`
- `./docs/<feature>/rules.md`

## Step 3: Find Related Code

Based on issue and docs:
1. Search codebase for relevant functions/files
2. Identify the likely location of the bug
3. Map the code flow around the issue

## Step 4: Analyze Root Cause

Compare:
- What the code does
- What the docs say it should do
- What the issue reports is happening

Identify:
- Is this a code bug (doesn't match docs)?
- Is this a docs bug (docs are wrong)?
- Is this a missing requirement (not in docs)?

## Step 5: Propose Fix

Present fix approach:
1. What will change
2. Which files will be modified
3. How this aligns with documentation

Ask user to confirm before implementing.

## Step 6: Implement Fix

1. Make the code change
2. Validate fix matches documented behavior
3. Check for side effects on related features

## Step 7: Verify Fix

- [ ] Issue is resolved
- [ ] Fix matches documentation
- [ ] No regression in related features
- [ ] Code follows existing patterns

---

*Auto-generated from [`.claude/commands/fix-issue.md`](https://github.com/quochuydev/workflow/blob/main/.claude/commands/fix-issue.md)*
