---
sidebar_position: 1
title: "Deploy Documentation"
description: "GitHub Action: Deploy Documentation"
---

# Deploy Documentation

## Triggers

- **push**: watches `docs-site/**, .claude/commands/**, .github/workflows/**, docs/**`
- **workflow_dispatch**

## Jobs

- `build`
- `deploy`

## Full Workflow

```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main
    paths:
      - 'docs-site/**'
      - '.claude/commands/**'
      - '.github/workflows/**'
      - 'docs/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: docs-site/package-lock.json

      - name: Install dependencies
        working-directory: docs-site
        run: npm ci

      - name: Generate docs from source
        working-directory: docs-site
        run: npm run generate

      - name: Build Docusaurus
        working-directory: docs-site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs-site/build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

```

---

*Auto-generated from [`.github/workflows/deploy-docs.yml`](https://github.com/quochuydev/workflow/blob/main/.github/workflows/deploy-docs.yml)*
