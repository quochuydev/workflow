#!/usr/bin/env node

/**
 * Auto-generates documentation from:
 * - .claude/commands/*.md -> docs/commands/
 * - .github/workflows/*.yml -> docs/github-actions/
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const ROOT_DIR = path.resolve(__dirname, '../..');
const DOCS_DIR = path.resolve(__dirname, '../docs');

// Ensure output directories exist
const COMMANDS_OUT = path.join(DOCS_DIR, 'commands');
const ACTIONS_OUT = path.join(DOCS_DIR, 'github-actions');

fs.mkdirSync(COMMANDS_OUT, { recursive: true });
fs.mkdirSync(ACTIONS_OUT, { recursive: true });

/**
 * Parse YAML frontmatter from markdown
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    try {
      return {
        frontmatter: yaml.parse(match[1]),
        body: match[2].trim()
      };
    } catch (e) {
      return { frontmatter: {}, body: content };
    }
  }
  return { frontmatter: {}, body: content };
}

/**
 * Generate docs for Claude commands
 */
function generateCommandDocs() {
  const commandsDir = path.join(ROOT_DIR, '.claude/commands');

  if (!fs.existsSync(commandsDir)) {
    console.log('No .claude/commands directory found, skipping...');
    return [];
  }

  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));
  const commands = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(commandsDir, file), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const slug = file.replace('.md', '');

    const commandName = frontmatter.name || slug;
    const description = frontmatter.description || '';
    const args = frontmatter.arguments || [];

    // Build the output markdown
    let output = `---
sidebar_position: ${files.indexOf(file) + 1}
title: "/${commandName}"
description: "${description}"
---

# /${commandName}

> ${description}

## Usage

\`\`\`
/${commandName}${args.length > 0 ? ' ' + args.map(a => `<${a.name}>`).join(' ') : ''}
\`\`\`

`;

    if (args.length > 0) {
      output += `## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
`;
      for (const arg of args) {
        output += `| \`${arg.name}\` | ${arg.description || ''} | ${arg.required ? 'Yes' : 'No'} |\n`;
      }
      output += '\n';
    }

    output += `## What This Command Does

${body}

---

*Auto-generated from [\`.claude/commands/${file}\`](https://github.com/quochuydev/workflow/blob/main/.claude/commands/${file})*
`;

    fs.writeFileSync(path.join(COMMANDS_OUT, `${slug}.md`), output);
    commands.push({ slug, name: commandName, description });
    console.log(`Generated: commands/${slug}.md`);
  }

  return commands;
}

/**
 * Generate docs for GitHub Actions
 */
function generateActionDocs() {
  const workflowsDir = path.join(ROOT_DIR, '.github/workflows');

  if (!fs.existsSync(workflowsDir)) {
    console.log('No .github/workflows directory found, skipping...');
    return [];
  }

  const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  const actions = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(workflowsDir, file), 'utf-8');
    let workflow;
    try {
      workflow = yaml.parse(content);
    } catch (e) {
      console.error(`Failed to parse ${file}:`, e.message);
      continue;
    }

    const slug = file.replace(/\.ya?ml$/, '');
    const name = workflow.name || slug;

    // Extract trigger info
    const triggers = workflow.on ? Object.keys(workflow.on) : [];
    const triggerDetails = [];

    if (workflow.on) {
      for (const [trigger, config] of Object.entries(workflow.on)) {
        if (typeof config === 'object' && config !== null) {
          if (config.paths) {
            triggerDetails.push(`**${trigger}**: watches \`${config.paths.join(', ')}\``);
          } else if (config.branches) {
            triggerDetails.push(`**${trigger}**: on branches \`${config.branches.join(', ')}\``);
          } else {
            triggerDetails.push(`**${trigger}**`);
          }
        } else {
          triggerDetails.push(`**${trigger}**`);
        }
      }
    }

    // Extract jobs info
    const jobs = workflow.jobs ? Object.keys(workflow.jobs) : [];

    let output = `---
sidebar_position: ${files.indexOf(file) + 1}
title: "${name}"
description: "GitHub Action: ${name}"
---

# ${name}

## Triggers

${triggerDetails.length > 0 ? triggerDetails.map(t => `- ${t}`).join('\n') : 'No triggers defined'}

## Jobs

${jobs.map(j => `- \`${j}\``).join('\n')}

## Full Workflow

\`\`\`yaml
${content}
\`\`\`

---

*Auto-generated from [\`.github/workflows/${file}\`](https://github.com/quochuydev/workflow/blob/main/.github/workflows/${file})*
`;

    fs.writeFileSync(path.join(ACTIONS_OUT, `${slug}.md`), output);
    actions.push({ slug, name });
    console.log(`Generated: github-actions/${slug}.md`);
  }

  return actions;
}

/**
 * Generate index files for each section
 */
function generateIndexFiles(commands, actions) {
  // Commands index
  const commandsIndex = `---
sidebar_position: 1
title: "Commands Overview"
---

# Claude Commands

These commands are available in Claude Code for this project.

| Command | Description |
|---------|-------------|
${commands.map(c => `| [\`/${c.name}\`](./${c.slug}) | ${c.description} |`).join('\n')}

## How to Use

In Claude Code, simply type the command name:

\`\`\`
/develop-feature user-auth
\`\`\`

Claude will read the command definition and follow its instructions.
`;

  fs.writeFileSync(path.join(COMMANDS_OUT, '_index.md'), commandsIndex);

  // Actions index
  const actionsIndex = `---
sidebar_position: 1
title: "GitHub Actions Overview"
---

# GitHub Actions

These workflows automate the team workflow.

| Workflow | Purpose |
|----------|---------|
${actions.map(a => `| [${a.name}](./${a.slug}) | Automation workflow |`).join('\n')}

## How They Work

1. **Doc Change Notify** - Notifies team when documentation changes
2. **Trigger n8n** - Sends webhooks to n8n for test automation
`;

  fs.writeFileSync(path.join(ACTIONS_OUT, '_index.md'), actionsIndex);
}

// Run generation
console.log('Generating documentation...\n');
const commands = generateCommandDocs();
const actions = generateActionDocs();
generateIndexFiles(commands, actions);
console.log('\nDone!');
