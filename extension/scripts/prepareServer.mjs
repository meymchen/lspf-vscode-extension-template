import { chmod, copyFile, mkdir, readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const extensionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(extensionRoot, '..');
const manifest = JSON.parse(await readFile(path.join(extensionRoot, 'package.json'), 'utf8'));
const suffix = process.platform === 'win32' ? '.exe' : '';

const build = spawnSync('cargo', ['build', '--release'], {
    cwd: repositoryRoot,
    stdio: 'inherit',
});
if (build.status !== 0) {
    process.exit(build.status ?? 1);
}

const source = path.join(repositoryRoot, 'target', 'release', `${manifest.name}${suffix}`);
const destinationDirectory = path.join(extensionRoot, 'server');
const destination = path.join(destinationDirectory, `${manifest.name}${suffix}`);
await mkdir(destinationDirectory, { recursive: true });
await copyFile(source, destination);
if (process.platform !== 'win32') {
    await chmod(destination, 0o755);
}
