# DAO Members Viewer

A mini app that displays all controllers (members) of a LUKSO Universal Profile's Key Manager, with their LSP6 permissions, allowed calls, and profile metadata.

## Features

- View all controllers of any Universal Profile
- LSP3 profile metadata (name, image) for contract controllers
- LSP6 permissions decoded into readable labels
- Allowed calls and ERC725Y data keys display
- Dark mode support (`?darkmode=true`)
- Responsive grid layout
- Supports LUKSO mainnet (42) and testnet (4201)

## URL Format

```
/#/{chainId}/{address}
```

Defaults to mainnet with the agent council address.

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
npm run deploy
```
