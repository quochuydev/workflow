#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { runPrompts } from '../lib/prompts.js';
import { copyTemplates } from '../lib/copy.js';
import { checkVersion, writeVersion, CURRENT_VERSION } from '../lib/version.js';

async function main() {
  const args = process.argv.slice(2);
  const isUpdate = args.includes('--update');

  console.log(chalk.bold('\n🤖 Create AI Team Workflow\n'));

  // Check existing version
  const existingVersion = checkVersion();

  if (existingVersion) {
    if (!isUpdate) {
      console.log(chalk.yellow(`ℹ You have v${existingVersion} installed, latest is v${CURRENT_VERSION}\n`));
      console.log(chalk.gray('Run with --update to upgrade files\n'));
    } else {
      console.log(chalk.blue(`Updating from v${existingVersion} to v${CURRENT_VERSION}\n`));
    }
  }

  // Get user selections
  const selections = await runPrompts(isUpdate);

  if (!selections) {
    console.log(chalk.gray('\nCancelled.\n'));
    process.exit(0);
  }

  // Create and cd into folder if specified
  if (selections.folderName) {
    const targetDir = path.resolve(process.cwd(), selections.folderName);
    await fs.ensureDir(targetDir);
    process.chdir(targetDir);
  }

  // Copy selected templates
  const results = await copyTemplates(selections, isUpdate);

  // Write version file
  writeVersion();

  // Show results
  console.log(chalk.green('\n✓ Done!\n'));

  if (results.created.length > 0) {
    console.log(chalk.bold('Created:'));
    results.created.forEach((f) => console.log(chalk.gray(`  ${f}`)));
  }

  if (results.skipped.length > 0) {
    console.log(chalk.bold('\nSkipped (already exist):'));
    results.skipped.forEach((f) => console.log(chalk.gray(`  ${f}`)));
  }

  if (results.backed.length > 0) {
    console.log(chalk.bold('\nBacked up & updated:'));
    results.backed.forEach((f) => console.log(chalk.gray(`  ${f}`)));
  }

  // Next steps
  console.log(chalk.bold('\nNext steps:'));
  if (selections.folderName) {
    console.log('  1. ' + chalk.cyan(`cd ${selections.folderName}`));
    console.log('  2. Create your first feature doc: ' + chalk.cyan('docs/my-feature/spec.md'));
    console.log('  3. Run in Claude Code: ' + chalk.cyan('/develop-feature my-feature'));
  } else {
    console.log('  1. Create your first feature doc: ' + chalk.cyan('docs/my-feature/spec.md'));
    console.log('  2. Run in Claude Code: ' + chalk.cyan('/develop-feature my-feature'));
  }
  console.log('');
}

main().catch((err) => {
  console.error(chalk.red('Error:'), err.message);
  process.exit(1);
});
