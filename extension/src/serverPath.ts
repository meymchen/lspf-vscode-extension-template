import * as path from 'node:path';

export function executableName(packageName: string, platform: NodeJS.Platform): string {
    return platform === 'win32' ? `${packageName}.exe` : packageName;
}

export function resolveServerBinary(
    extensionPath: string,
    packageName: string,
    development: boolean,
    platform: NodeJS.Platform = process.platform,
): string {
    const executable = executableName(packageName, platform);
    return development
        ? path.resolve(extensionPath, '..', 'target', 'debug', executable)
        : path.join(extensionPath, 'server', executable);
}
