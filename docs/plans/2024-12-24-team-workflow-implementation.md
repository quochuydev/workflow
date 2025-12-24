# Team Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a GitHub-centric workflow connecting PM/BA docs with developers using Claude Code and QC using n8n.

**Architecture:** GitHub Actions detect doc changes and trigger notifications. Claude commands read from `./docs/` as source of truth. n8n receives webhooks for test automation.

**Tech Stack:** GitHub Actions (YAML), Claude Code commands (Markdown), n8n (external, webhook-triggered)

---

## Task 1: Create Folder Structure

**Files:**
- Create: `.claude/settings.json`
- Create: `.claude/commands/` (directory)
- Create: `.github/workflows/` (directory)
- Create: `docs/README.md`

**Step 1: Create .claude directory structure**

```bash
mkdir -p .claude/commands
```

**Step 2: Create Claude settings.json**

Create `.claude/settings.json`:
```json
{
  "project": {
    "name": "team-workflow",
    "docsPath": "./docs"
  }
}
```

**Step 3: Create .github/workflows directory**

```bash
mkdir -p .github/workflows
```

**Step 4: Create docs README for PM/BA**

Create `docs/README.md`:
```markdown
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
```

**Step 5: Commit folder structure**

```bash
git add .claude docs/README.md .github
git commit -m "feat: add folder structure for team workflow"
```

---

## Task 2: Create /develop-feature Command

**Files:**
- Create: `.claude/commands/develop-feature.md`

**Step 1: Create the command file**

Create `.claude/commands/develop-feature.md`:
```markdown
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
```

**Step 2: Verify file was created**

```bash
cat .claude/commands/develop-feature.md | head -20
```

**Step 3: Commit**

```bash
git add .claude/commands/develop-feature.md
git commit -m "feat: add /develop-feature command"
```

---

## Task 3: Create /fix-issue Command

**Files:**
- Create: `.claude/commands/fix-issue.md`

**Step 1: Create the command file**

Create `.claude/commands/fix-issue.md`:
```markdown
---
name: fix-issue
description: Fix a bug with context from docs and code
arguments:
  - name: issue
    description: Issue description or GitHub issue link
    required: true
---

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
```

**Step 2: Commit**

```bash
git add .claude/commands/fix-issue.md
git commit -m "feat: add /fix-issue command"
```

---

## Task 4: Create /trace-flow Command

**Files:**
- Create: `.claude/commands/trace-flow.md`

**Step 1: Create the command file**

Create `.claude/commands/trace-flow.md`:
```markdown
---
name: trace-flow
description: Trace code flow with business context from docs
arguments:
  - name: target
    description: Function name, endpoint, or file to trace from
    required: true
---

# Trace Flow: $ARGUMENTS.target

You are tracing code flow to understand how `$ARGUMENTS.target` works, with business context from documentation.

## Step 1: Find Entry Point

Locate `$ARGUMENTS.target` in the codebase:
- Search for function/method name
- Search for API endpoint
- Search for file path

Report:
```
ENTRY POINT FOUND:
→ [type] [name] ([file path]:[line number])
```

## Step 2: Map Call Chain

Trace all function calls from entry point:
- Follow function calls depth-first
- Note file and line number for each
- Stop at external libraries/APIs

Report as tree:
```
CALL CHAIN:
[entry point]
  → [function1]()         ([file]:[line])
    → [function2]()       ([file]:[line])
      → [function3]()     ([file]:[line])
    → [function4]()       ([file]:[line])
  → [function5]()         ([file]:[line])
```

## Step 3: Find Related Documentation

Search `./docs/` for features related to this flow:
1. Match function/endpoint names to feature folders
2. Search for keywords in spec.md and rules.md files

For each related feature, extract relevant rules.

Report:
```
RELATED BUSINESS RULES:
From ./docs/[feature]/rules.md:
- [Rule 1]
- [Rule 2]
- [Rule 3]
```

## Step 4: Identify Data Flow

Track data through the call chain:
- What parameters are passed
- What is returned
- Where data is transformed

Report:
```
DATA FLOW:
Input: [describe input data]
  → [function1]: [transformation]
  → [function2]: [transformation]
Output: [describe output data]
```

## Step 5: Flag Potential Issues

Based on code and docs, identify:
- Places where code might not match documented rules
- Complex logic that could hide bugs
- Missing error handling
- Potential race conditions

Report:
```
POTENTIAL ISSUE AREAS:
- [function](): [concern]
- [function](): [concern]
```

## Step 6: Summary

Provide concise summary:
- What this flow does (1-2 sentences)
- Key business rules that apply
- Suggested areas to investigate (if debugging)
```

**Step 2: Commit**

```bash
git add .claude/commands/trace-flow.md
git commit -m "feat: add /trace-flow command"
```

---

## Task 5: Create Doc Change Notification GitHub Action

**Files:**
- Create: `.github/workflows/doc-change-notify.yml`

**Step 1: Create the workflow file**

Create `.github/workflows/doc-change-notify.yml`:
```yaml
name: Doc Change Notification

on:
  push:
    paths:
      - 'docs/**'
    branches:
      - main
      - master
  pull_request:
    paths:
      - 'docs/**'

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Get changed files
        id: changed-files
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            BASE_SHA=${{ github.event.pull_request.base.sha }}
            HEAD_SHA=${{ github.event.pull_request.head.sha }}
          else
            BASE_SHA=${{ github.event.before }}
            HEAD_SHA=${{ github.sha }}
          fi

          # Get changed files in docs/
          CHANGED=$(git diff --name-only $BASE_SHA $HEAD_SHA -- docs/ | grep -v '^docs/plans/' || true)

          if [ -z "$CHANGED" ]; then
            echo "No doc changes (excluding plans/)"
            echo "has_changes=false" >> $GITHUB_OUTPUT
            exit 0
          fi

          echo "has_changes=true" >> $GITHUB_OUTPUT

          # Extract unique feature folders
          FEATURES=$(echo "$CHANGED" | sed 's|docs/||' | cut -d'/' -f1 | sort -u | grep -v '\.md$' || true)

          # Build summary
          echo "## Documentation Changes" > summary.md
          echo "" >> summary.md

          if [ -n "$FEATURES" ]; then
            echo "### Features Updated:" >> summary.md
            for feature in $FEATURES; do
              echo "- **$feature**" >> summary.md
              # List changed files for this feature
              echo "$CHANGED" | grep "docs/$feature/" | while read file; do
                echo "  - \`$(basename $file)\`" >> summary.md
              done
            done
          fi

          # List any root-level doc changes
          ROOT_DOCS=$(echo "$CHANGED" | grep -E '^docs/[^/]+\.md$' || true)
          if [ -n "$ROOT_DOCS" ]; then
            echo "" >> summary.md
            echo "### Other Docs:" >> summary.md
            echo "$ROOT_DOCS" | while read file; do
              echo "- \`$(basename $file)\`" >> summary.md
            done
          fi

          echo "" >> summary.md
          echo "---" >> summary.md
          echo "*Developers: Run \`/develop-feature <feature-name>\` to get full context.*" >> summary.md

          cat summary.md

          # Save for later steps
          {
            echo 'summary<<EOF'
            cat summary.md
            echo EOF
          } >> $GITHUB_OUTPUT

      - name: Comment on PR
        if: github.event_name == 'pull_request' && steps.changed-files.outputs.has_changes == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `${{ steps.changed-files.outputs.summary }}`
            })

      - name: Send Slack notification
        if: github.event_name == 'push' && steps.changed-files.outputs.has_changes == 'true'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: |
          if [ -z "$SLACK_WEBHOOK_URL" ]; then
            echo "SLACK_WEBHOOK_URL not set, skipping Slack notification"
            exit 0
          fi

          # Convert markdown to Slack-friendly format
          SUMMARY=$(cat summary.md | sed 's/##/#/g' | sed 's/\*\*//g' | sed 's/`//g')

          curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\": \"$SUMMARY\n\nCommit: ${{ github.sha }}\nBy: ${{ github.actor }}\"}" \
            $SLACK_WEBHOOK_URL
```

**Step 2: Commit**

```bash
git add .github/workflows/doc-change-notify.yml
git commit -m "feat: add doc change notification GitHub Action"
```

---

## Task 6: Create n8n Trigger GitHub Action

**Files:**
- Create: `.github/workflows/trigger-n8n.yml`

**Step 1: Create the workflow file**

Create `.github/workflows/trigger-n8n.yml`:
```yaml
name: Trigger n8n Tests

on:
  push:
    branches:
      - main
      - master
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  trigger-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Detect changed features
        id: detect
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            BASE_SHA=${{ github.event.pull_request.base.sha }}
            HEAD_SHA=${{ github.event.pull_request.head.sha }}
          else
            BASE_SHA=${{ github.event.before }}
            HEAD_SHA=${{ github.sha }}
          fi

          # Get all changed files
          CHANGED=$(git diff --name-only $BASE_SHA $HEAD_SHA || true)

          if [ -z "$CHANGED" ]; then
            echo "No changes detected"
            echo "has_changes=false" >> $GITHUB_OUTPUT
            exit 0
          fi

          echo "has_changes=true" >> $GITHUB_OUTPUT

          # Try to map changed files to features
          # Look for feature references in docs or src folders
          FEATURES=""

          # Check for doc changes
          DOC_FEATURES=$(echo "$CHANGED" | grep '^docs/' | sed 's|docs/||' | cut -d'/' -f1 | sort -u | grep -v '\.md$' | grep -v 'plans' || true)

          # Check for src changes that might map to features
          # This is project-specific - adjust pattern as needed
          SRC_FEATURES=$(echo "$CHANGED" | grep '^src/' | sed 's|src/||' | cut -d'/' -f1 | sort -u || true)

          # Combine and dedupe
          ALL_FEATURES=$(echo -e "$DOC_FEATURES\n$SRC_FEATURES" | sort -u | grep -v '^$' || true)

          echo "Affected features: $ALL_FEATURES"

          # Convert to JSON array
          FEATURES_JSON=$(echo "$ALL_FEATURES" | jq -R -s -c 'split("\n") | map(select(length > 0))')
          echo "features=$FEATURES_JSON" >> $GITHUB_OUTPUT

          # Get list of changed files
          FILES_JSON=$(echo "$CHANGED" | jq -R -s -c 'split("\n") | map(select(length > 0))')
          echo "files=$FILES_JSON" >> $GITHUB_OUTPUT

      - name: Trigger n8n webhook
        if: steps.detect.outputs.has_changes == 'true'
        env:
          N8N_WEBHOOK_URL: ${{ secrets.N8N_WEBHOOK_URL }}
        run: |
          if [ -z "$N8N_WEBHOOK_URL" ]; then
            echo "N8N_WEBHOOK_URL not set, skipping n8n trigger"
            exit 0
          fi

          PAYLOAD=$(cat <<EOF
          {
            "event": "${{ github.event_name }}",
            "repository": "${{ github.repository }}",
            "ref": "${{ github.ref }}",
            "sha": "${{ github.sha }}",
            "actor": "${{ github.actor }}",
            "features": ${{ steps.detect.outputs.features }},
            "changed_files": ${{ steps.detect.outputs.files }},
            "pr_number": "${{ github.event.pull_request.number || '' }}",
            "pr_title": "${{ github.event.pull_request.title || '' }}"
          }
          EOF
          )

          echo "Sending payload to n8n..."
          echo "$PAYLOAD" | jq .

          curl -X POST \
            -H "Content-Type: application/json" \
            -d "$PAYLOAD" \
            "$N8N_WEBHOOK_URL"
```

**Step 2: Commit**

```bash
git add .github/workflows/trigger-n8n.yml
git commit -m "feat: add n8n trigger GitHub Action"
```

---

## Task 7: Create Example Feature Documentation

**Files:**
- Create: `docs/example-feature/spec.md`
- Create: `docs/example-feature/rules.md`
- Create: `docs/example-feature/examples/valid-input.json`
- Create: `docs/example-feature/examples/invalid-input.json`

**Step 1: Create example feature directory**

```bash
mkdir -p docs/example-feature/examples
```

**Step 2: Create spec.md**

Create `docs/example-feature/spec.md`:
```markdown
# Example Feature

## Overview

This is an example feature to demonstrate the documentation structure.

## User Story

As a **developer**, I want **example documentation**, so that **I understand how to write specs for my features**.

## Acceptance Criteria

- [ ] User can view list of items
- [ ] User can add new item
- [ ] User can delete existing item
- [ ] Items persist across page refresh

## API Endpoints

### GET /api/items

Returns list of all items.

**Response:**
```json
{
  "items": [
    { "id": "1", "name": "Item 1", "createdAt": "2024-01-01T00:00:00Z" }
  ]
}
```

### POST /api/items

Creates a new item.

**Request:**
```json
{
  "name": "New Item"
}
```

**Response:**
```json
{
  "id": "2",
  "name": "New Item",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### DELETE /api/items/:id

Deletes an item by ID.

**Response:** 204 No Content
```

**Step 3: Create rules.md**

Create `docs/example-feature/rules.md`:
```markdown
# Example Feature - Business Rules

## Validation Rules

1. **Item name required** - Name cannot be empty or whitespace only
2. **Item name length** - Name must be 1-100 characters
3. **Item name unique** - No duplicate names allowed

## Business Rules

1. **Soft delete** - Items are not permanently deleted, only marked as deleted
2. **Audit trail** - All changes must be logged with timestamp and user
3. **Rate limiting** - Maximum 100 items per user

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty name submitted | Return 400 with message "Name is required" |
| Name > 100 chars | Return 400 with message "Name too long" |
| Duplicate name | Return 409 with message "Item already exists" |
| Delete non-existent item | Return 404 with message "Item not found" |
| Rate limit exceeded | Return 429 with message "Too many items" |

## Error Handling

All errors return JSON:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```
```

**Step 4: Create example input files**

Create `docs/example-feature/examples/valid-input.json`:
```json
{
  "name": "My Valid Item"
}
```

Create `docs/example-feature/examples/invalid-input.json`:
```json
{
  "name": ""
}
```

**Step 5: Commit**

```bash
git add docs/example-feature/
git commit -m "feat: add example feature documentation"
```

---

## Task 8: Create n8n Workflow Documentation

**Files:**
- Create: `docs/n8n-setup.md`

**Step 1: Create n8n setup guide**

Create `docs/n8n-setup.md`:
```markdown
# n8n Setup Guide

This guide explains how to set up n8n workflows for automated testing.

## Prerequisites

- n8n instance running (cloud or self-hosted)
- GitHub repository secrets configured

## GitHub Secrets Required

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `N8N_WEBHOOK_URL` | Your n8n webhook URL |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL (optional) |

## n8n Workflow Setup

### 1. Create Webhook Trigger

1. In n8n, create new workflow
2. Add **Webhook** node as trigger
3. Set method to POST
4. Copy the webhook URL
5. Add URL to GitHub secrets as `N8N_WEBHOOK_URL`

### 2. Parse Incoming Data

Add **Set** node to extract:
- `features` - Array of affected feature names
- `changed_files` - Array of changed file paths
- `event` - "push" or "pull_request"
- `sha` - Commit SHA
- `pr_number` - PR number (if applicable)

### 3. Route by Feature

Add **Switch** node to route based on feature:
- Each output routes to feature-specific test workflow
- Default output for unknown features

### 4. Test Data Setup

For each feature test:
1. Add **HTTP Request** node to create test data
2. Configure your API endpoint
3. Set authentication headers

### 5. Run API Tests

Add **HTTP Request** nodes for each test case:
1. Make request to endpoint
2. Add **IF** node to check response
3. Compare against expected values

### 6. Report Results

Add **Slack** node (or other notification):
- Send pass/fail status
- Include test details
- Link to PR if applicable

## Example Workflow Structure

```
[Webhook]
    → [Set: Parse Data]
    → [Switch: By Feature]
        → [Feature A Tests]
            → [Setup Data]
            → [Test 1] → [Check Result]
            → [Test 2] → [Check Result]
            → [Report]
        → [Feature B Tests]
            → ...
```

## Webhook Payload Format

GitHub Action sends this payload:

```json
{
  "event": "push",
  "repository": "owner/repo",
  "ref": "refs/heads/main",
  "sha": "abc123...",
  "actor": "username",
  "features": ["feature-a", "feature-b"],
  "changed_files": ["src/api/items.ts", "docs/feature-a/spec.md"],
  "pr_number": "123",
  "pr_title": "Add new feature"
}
```

## Tips

- Start simple: one test per feature
- Add complexity as needed
- Use n8n's built-in error handling
- Test webhooks with manual triggers first
```

**Step 2: Commit**

```bash
git add docs/n8n-setup.md
git commit -m "docs: add n8n setup guide"
```

---

## Task 9: Final Verification and Summary Commit

**Step 1: Verify all files exist**

```bash
echo "=== Folder Structure ===" && \
find . -type f -name "*.md" -o -name "*.yml" -o -name "*.json" | grep -v node_modules | sort
```

Expected output:
```
./.claude/settings.json
./.claude/commands/develop-feature.md
./.claude/commands/fix-issue.md
./.claude/commands/trace-flow.md
./.github/workflows/doc-change-notify.yml
./.github/workflows/trigger-n8n.yml
./docs/README.md
./docs/example-feature/spec.md
./docs/example-feature/rules.md
./docs/example-feature/examples/valid-input.json
./docs/example-feature/examples/invalid-input.json
./docs/n8n-setup.md
./docs/plans/2024-12-24-team-workflow-design.md
./docs/plans/2024-12-24-team-workflow-implementation.md
```

**Step 2: Test commands are recognized**

```bash
ls -la .claude/commands/
```

**Step 3: View git log**

```bash
git log --oneline
```

---

## Summary

After completing all tasks, you will have:

| Component | Files |
|-----------|-------|
| Claude Commands | `.claude/commands/develop-feature.md`, `fix-issue.md`, `trace-flow.md` |
| GitHub Actions | `.github/workflows/doc-change-notify.yml`, `trigger-n8n.yml` |
| Documentation | `docs/README.md`, `docs/n8n-setup.md` |
| Example Feature | `docs/example-feature/` with spec, rules, examples |

**Next steps for your team:**
1. Add `SLACK_WEBHOOK_URL` secret to GitHub for notifications
2. Set up n8n instance and add `N8N_WEBHOOK_URL` secret
3. Create your first real feature docs in `docs/<feature-name>/`
4. Try running `/develop-feature example-feature` to test the command
