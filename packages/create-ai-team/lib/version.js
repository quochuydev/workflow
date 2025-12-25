import fs from 'fs-extra';
import path from 'path';

export const CURRENT_VERSION = '1.0.0';
const VERSION_FILE = '.claude/.ai-team-version';

export function checkVersion() {
  const cwd = process.cwd();
  const versionPath = path.join(cwd, VERSION_FILE);

  try {
    if (fs.existsSync(versionPath)) {
      return fs.readFileSync(versionPath, 'utf-8').trim();
    }
  } catch {
    // Ignore read errors
  }

  return null;
}

export function writeVersion() {
  const cwd = process.cwd();
  const versionPath = path.join(cwd, VERSION_FILE);

  fs.ensureDirSync(path.dirname(versionPath));
  fs.writeFileSync(versionPath, CURRENT_VERSION + '\n');
}
