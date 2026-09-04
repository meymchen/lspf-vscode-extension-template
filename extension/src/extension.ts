import type { ExtensionContext } from 'vscode';
import { ExtensionMode } from 'vscode';
import {
    LanguageClient,
    TransportKind,
    type LanguageClientOptions,
    type ServerOptions,
} from 'vscode-languageclient/node';

import { resolveServerBinary } from './serverPath.js';

interface ExtensionManifest {
    name: string;
    displayName?: string;
    contributes?: {
        languages?: Array<{ id: string }>;
    };
}

let client: LanguageClient | undefined;

export async function activate(context: ExtensionContext): Promise<void> {
    const manifest = context.extension.packageJSON as ExtensionManifest;
    const languageId = manifest.contributes?.languages?.[0]?.id;
    if (!languageId) {
        throw new Error('package.json must contribute at least one language');
    }

    const command = resolveServerBinary(
        context.extensionPath,
        manifest.name,
        context.extensionMode === ExtensionMode.Development,
    );
    const serverOptions: ServerOptions = {
        command,
        transport: TransportKind.stdio,
        options: {
            env: {
                ...process.env,
                RUST_LOG: process.env.RUST_LOG ?? 'info',
                LSPF_LOG_FORMAT: process.env.LSPF_LOG_FORMAT ?? 'json',
            },
        },
    };
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ language: languageId, scheme: 'file' }],
        outputChannelName: manifest.displayName ?? manifest.name,
    };

    client = new LanguageClient(
        manifest.name,
        manifest.displayName ?? manifest.name,
        serverOptions,
        clientOptions,
    );
    await client.start();
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}
