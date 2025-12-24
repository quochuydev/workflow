# n8n Setup Guide

> **This integration is OPTIONAL.** If your team does not use n8n, simply delete `.github/workflows/trigger-n8n.yml` from your repository.

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
