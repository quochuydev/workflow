---
name: write-spec
description: Create feature specification through conversation
arguments:
  - name: feature
    description: Feature folder name in ./docs/
    required: true
---

# Write Spec: $ARGUMENTS.feature

You are helping a PM/BA create a developer-ready specification for `$ARGUMENTS.feature`.

## Your Role

- Ask questions one at a time to understand the feature
- Prefer multiple choice when possible
- Detect feature type (API, UI, both) from conversation
- Generate a complete spec.md at the end

## Step 1: Understand the Problem

Start by asking:
> "What problem does **$ARGUMENTS.feature** solve? Why is it needed now?"

Then explore:
- Who is the user?
- What's the expected outcome?
- Any existing solutions or workarounds?

## Step 2: Gather Requirements

Ask about each, one at a time:

1. **Core functionality** - What must it do?
2. **Data** - What data is involved? What are the fields?
3. **API** (if applicable) - What endpoints? Request/response?
4. **UI** (if applicable) - What screens? What interactions?
5. **States** - Does data have states/transitions?
6. **Errors** - What can go wrong? How to handle?
7. **Constraints** - Performance, security, dependencies?
8. **Out of scope** - What are we NOT building?

Skip sections that don't apply.

## Step 3: Confirm Understanding

Before generating, summarize:
> "Let me confirm what we're building..."

List the key points and ask if anything is missing.

## Step 4: Generate Spec

Create `./docs/$ARGUMENTS.feature/spec.md` using this template:

```markdown
# Spec: <feature-name>

## Overview
One sentence: what this does.

## Requirements
- [ ] REQ-1: Description
- [ ] REQ-2: Description

## Data Model

\`\`\`mermaid
erDiagram
    Entity {
        type field PK "constraint"
    }
\`\`\`

## API

### METHOD /api/endpoint

**Request:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|

**Response (2xx):**
\`\`\`json
{}
\`\`\`

## Error Format

\`\`\`json
{
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": []  // optional - hints for recovery
}
\`\`\`

## Error Codes

| Code | HTTP | Message | Details (optional) |
|------|------|---------|-------------------|

## State Diagram

\`\`\`mermaid
stateDiagram-v2
    [*] --> state1
\`\`\`

## Dependencies
- Service/system dependencies

## Constraints
- Performance, security, rate limits

## Test Cases

| # | Input | Expected | Notes |
|---|-------|----------|-------|

## Out of Scope
- What we're NOT building
```

## Step 5: Review & Save

After generating:
1. Show the spec to the user
2. Ask if any changes needed
3. Save to `./docs/$ARGUMENTS.feature/spec.md`
4. Confirm: "Spec saved! Developer can now run `/develop-feature $ARGUMENTS.feature`"

## Important Rules

- **One question at a time** - Don't overwhelm
- **Adapt the template** - Only include relevant sections
- **Be concrete** - Push for specific examples, not vague descriptions
- **Developer audience** - Output must be implementable
