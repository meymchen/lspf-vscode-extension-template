# lspf VS Code extension template

A working Rust language server and VS Code extension built with
[lspf](https://github.com/meymchen/lspf). The repository works as-is and also
supports project generation with `cargo-generate`.

## Use it directly

Create a repository from this GitHub template or clone it, then run:

```sh
cargo test
npm --prefix extension install
npm --prefix extension test
code .
```

In VS Code, select **Run language extension** and press F5. In the Extension
Development Host, create a file ending in `.hello`. The server publishes a
diagnostic and provides hover and completion responses.

The checked-in `Cargo.toml` and `extension/package.json` are runnable defaults.
Their `.liquid` counterparts are used only by `cargo-generate`.

## Generate a named project

Install `cargo-generate`, then create a project:

```sh
cargo install cargo-generate --locked
cargo generate meymchen/lspf-vscode-extension-template --name my-language
cd my-language
cargo test
npm --prefix extension ci
code .
```

The generator asks for the display name, Marketplace publisher, VS Code
language identifier, and primary file extension. For automation, provide them
with repeated `--define key=value` arguments and use `--silent`.

## Project layout

- `src/` contains the Rust language server.
- `tests/protocol.rs` drives the compiled server over real LSP stdio framing.
- `extension/` contains the TypeScript VS Code language client.
- `.vscode/` contains the one-command F5 development path.
- `.github/workflows/` tests both the raw repository and generated output.

## Customize the language server

Start in `src/main.rs`. `State` is where application-owned indexes and parsed
data belong. Open documents, the workspace snapshot, and the client connection
are available through `ServerContext`.

The example deliberately implements only three visible behaviours:

- a diagnostic after `textDocument/didOpen`;
- hover information;
- one completion item.

Replace these handlers with your parser and language logic. Add more lspf
feature registrations as the implementation grows.

## Package the extension

Development launches `target/debug/<package-name>`. Packaging builds a release
server, copies it into the extension, bundles the TypeScript client, and creates
a platform-specific VSIX:

```sh
npm --prefix extension run package -- --target linux-x64
```

Use the matching VS Code target for each supported platform, such as
`darwin-arm64` or `win32-x64`. A published extension must ship the server
binary; it must not depend on the user's Cargo installation or source tree.

Before publishing, replace the placeholder publisher, add repository and
support links to `extension/package.json`, and review the extension version and
Marketplace metadata.

## License

Licensed under either of

- Apache License, Version 2.0, or
- MIT license

at your option.
