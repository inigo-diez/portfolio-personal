// PostToolUse hook (Write|Edit): format and lint the file Claude just wrote.
// Only src/**/*.{ts,tsx,css}. Prettier rewrites the file in place; ESLint (ts/tsx only) then reports:
//   errors   -> decision "block": Claude gets the report and must fix them.
//   warnings -> additionalContext: Claude sees them, nothing is blocked.
// Any failure of the hook itself is ignored so it never gets in the way.
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const SRC = path.join(ROOT, 'src') + path.sep;

async function readStdin() {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return JSON.parse(data.replace(/^﻿/, ''));
}

async function main() {
  const input = await readStdin();
  const raw = input.tool_input?.file_path ?? input.tool_response?.filePath;
  if (!raw) return;
  const file = path.resolve(raw);
  const ext = path.extname(file);
  if (!file.toLowerCase().startsWith(SRC.toLowerCase()) || !['.ts', '.tsx', '.css'].includes(ext)) return;

  const prettier = await import('prettier');
  const source = await fs.readFile(file, 'utf8');
  const options = (await prettier.resolveConfig(file)) ?? {};
  const formatted = await prettier.format(source, { ...options, filepath: file });
  if (formatted !== source) await fs.writeFile(file, formatted);

  if (ext === '.css') return;
  const { ESLint } = await import('eslint');
  const eslint = new ESLint({ cwd: ROOT });
  const results = await eslint.lintFiles([file]);
  const errors = results.reduce((n, r) => n + r.errorCount, 0);
  const warnings = results.reduce((n, r) => n + r.warningCount, 0);
  if (!errors && !warnings) return;
  const report = (await (await eslint.loadFormatter('stylish')).format(results)).trim();
  const rel = path.relative(ROOT, file);
  if (errors) {
    console.log(JSON.stringify({ decision: 'block', reason: `ESLint found errors in ${rel}. Fix them:\n${report}` }));
  } else {
    console.log(
      JSON.stringify({
        hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `ESLint warnings in ${rel}:\n${report}` },
      }),
    );
  }
}

main().catch(() => {});
