import { execFileSync } from 'node:child_process';

const DEFAULT_BRANCH = 'master';
const VERSION_PATTERN = /^\d{4}\.\d{2}\.\d+$/;
const USAGE = 'Usage: npm run release -- <version> <milestone name>\n  e.g. npm run release -- 2026.09.2 "Writing, CV & immersive player"';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const gitLoud = (...args) => execFileSync('git', args, { stdio: 'inherit' });

const fail = message => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

const [version, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(' ').trim();

if (!version || !name) fail(USAGE);
if (!VERSION_PATTERN.test(version)) fail(`Version "${version}" must be CalVer YYYY.0M.patch — e.g. 2026.09.2`);

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== DEFAULT_BRANCH) fail(`Cut milestones from ${DEFAULT_BRANCH}, not "${branch}"`);

if (git('status', '--porcelain')) fail('Working tree is dirty — commit or stash before cutting a milestone');

git('fetch', 'origin', '--tags', '--quiet');
if (git('tag', '-l', version)) fail(`Tag ${version} already exists`);

const behind = git('rev-list', '--count', `HEAD..origin/${DEFAULT_BRANCH}`);
if (behind !== '0') fail(`Local ${DEFAULT_BRANCH} is ${behind} commit(s) behind origin — pull first`);

console.log(`→ Tagging ${version} — ${name} at ${git('rev-parse', '--short', 'HEAD')}`);
gitLoud('tag', '-a', version, '-m', name);
gitLoud('push', 'origin', version);

console.log('→ Regenerating changelog');
execFileSync('npm', ['run', 'changelog'], { stdio: 'inherit' });

if (!git('status', '--porcelain', 'CHANGELOG.md')) {
  console.log(`✓ Tag pushed; changelog already current for ${version}.`);
  process.exit(0);
}

gitLoud('add', 'CHANGELOG.md');
gitLoud('commit', '--no-verify', '-m', 'chore(changelog): regenerate CHANGELOG.md [skip ci]');
gitLoud('push', 'origin', DEFAULT_BRANCH);
console.log(`✓ Released ${version} — ${name}`);
