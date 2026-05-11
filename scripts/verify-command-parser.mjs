import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import * as esbuild from 'esbuild';

const tempDir = await mkdtemp(path.join(tmpdir(), 'soundgo-command-parser-'));
const entryPath = path.join(tempDir, 'entry.ts');
const bundlePath = path.join(tempDir, 'command-parser.mjs');

try {
    await writeFile(
        entryPath,
        [
            `export { parseCommand } from '${path.resolve('src/commands/commandParser.ts').replace(/\\/g, '/')}';`,
            `export { CommandType } from '${path.resolve('src/commands/commandTypes.ts').replace(/\\/g, '/')}';`,
        ].join('\n')
    );

    await esbuild.build({
        entryPoints: [entryPath],
        bundle: true,
        outfile: bundlePath,
        format: 'esm',
        platform: 'node',
        logLevel: 'silent',
    });

    const { parseCommand, CommandType } = await import(`file://${bundlePath.replace(/\\/g, '/')}`);

    const decimalMove = parseCommand('move cursor right by 10.5 pixels');
    assert.equal(
        decimalMove.type,
        CommandType.Unknown,
        'decimal movement distances must not be collapsed into larger integer values'
    );

    const punctuatedMove = parseCommand('move cursor right by 10 pixels.');
    assert.equal(punctuatedMove.type, CommandType.MoveCursor);
    assert.deepEqual(punctuatedMove.args, { direction: 'right', distance: 10 });

    const punctuatedClick = parseCommand('click.');
    assert.equal(punctuatedClick.type, CommandType.Click);
} finally {
    await rm(tempDir, { recursive: true, force: true });
}
