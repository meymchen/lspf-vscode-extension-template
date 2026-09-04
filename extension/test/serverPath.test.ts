import * as assert from 'node:assert/strict';
import * as path from 'node:path';
import test from 'node:test';

import { executableName, resolveServerBinary } from '../src/serverPath.js';

test('adds the executable suffix only on Windows', () => {
    assert.equal(executableName('demo-language', 'linux'), 'demo-language');
    assert.equal(executableName('demo-language', 'win32'), 'demo-language.exe');
});

test('resolves the debug server next to the extension directory', () => {
    assert.equal(
        resolveServerBinary('/repo/extension', 'demo-language', true, 'linux'),
        path.resolve('/repo/target/debug/demo-language'),
    );
});

test('resolves the server bundled in a production VSIX', () => {
    assert.equal(
        resolveServerBinary('/repo/extension', 'demo-language', false, 'win32'),
        path.join('/repo/extension/server/demo-language.exe'),
    );
});
