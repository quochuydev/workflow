import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const FILE_MAPPINGS = {
  claudeCommands: [
    { from: '.claude/commands/write-spec.md', to: '.claude/commands/write-spec.md' },
    { from: '.claude/commands/develop-feature.md', to: '.claude/commands/develop-feature.md' },
    { from: '.claude/commands/fix-issue.md', to: '.claude/commands/fix-issue.md' },
    { from: '.claude/commands/trace-flow.md', to: '.claude/commands/trace-flow.md' },
  ],
  githubActions: [
    { from: 'github/workflows/doc-change-notify.yml', to: '.github/workflows/doc-change-notify.yml' },
    { from: 'github/workflows/trigger-n8n.yml', to: '.github/workflows/trigger-n8n.yml' },
  ],
  exampleDocs: [
    { from: 'docs/example-feature/spec.md', to: 'docs/example-feature/spec.md' },
    { from: 'docs/example-feature/examples/valid-input.json', to: 'docs/example-feature/examples/valid-input.json' },
    { from: 'docs/example-feature/examples/invalid-input.json', to: 'docs/example-feature/examples/invalid-input.json' },
  ],
};

export async function copyTemplates(selections, isUpdate) {
  const results = {
    created: [],
    skipped: [],
    backed: [],
  };

  const cwd = process.cwd();

  for (const [key, enabled] of Object.entries(selections)) {
    if (!enabled) continue;

    const mappings = FILE_MAPPINGS[key];
    if (!mappings) continue;

    for (const { from, to } of mappings) {
      const srcPath = path.join(TEMPLATES_DIR, from);
      const destPath = path.join(cwd, to);

      const exists = await fs.pathExists(destPath);

      if (exists && !isUpdate) {
        results.skipped.push(to);
        continue;
      }

      if (exists && isUpdate) {
        // Backup existing file
        const backupPath = destPath + '.bak';
        await fs.copy(destPath, backupPath);
        results.backed.push(to);
      }

      // Ensure directory exists
      await fs.ensureDir(path.dirname(destPath));

      // Copy file
      await fs.copy(srcPath, destPath);

      if (!exists) {
        results.created.push(to);
      }
    }
  }

  return results;
}
