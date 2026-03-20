export const RPC_URLS: Record<number, string> = {
  42: 'https://rpc.mainnet.lukso.network',
  4201: 'https://rpc.testnet.lukso.network',
  1: 'https://eth.drpc.org',
  8453: 'https://mainnet.base.org',
}

export const CHAIN_NAMES: Record<number, string> = {
  42: 'LUKSO',
  4201: 'LUKSO Testnet',
  1: 'Ethereum',
  11155111: 'Ethereum Sepolia',
  8453: 'Base',
  84532: 'Base Sepolia',
}

export const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs/'

export const PERMISSION_LABELS: Record<string, string> = {
  CHANGEOWNER: 'Change Owner',
  ADDCONTROLLER: 'Add Controller',
  EDITPERMISSIONS: 'Edit Permissions',
  ADDEXTENSIONS: 'Add Extensions',
  CHANGEEXTENSIONS: 'Change Extensions',
  ADDUNIVERSALRECEIVERDELEGATE: 'Add URD',
  CHANGEUNIVERSALRECEIVERDELEGATE: 'Change URD',
  REENTRANCY: 'Reentrancy',
  SUPER_TRANSFERVALUE: 'Super Transfer Value',
  TRANSFERVALUE: 'Transfer Value',
  SUPER_CALL: 'Super Call',
  CALL: 'Call',
  SUPER_STATICCALL: 'Super Static Call',
  STATICCALL: 'Static Call',
  SUPER_DELEGATECALL: 'Super Delegate Call',
  DELEGATECALL: 'Delegate Call',
  DEPLOY: 'Deploy',
  SUPER_SETDATA: 'Super Set Data',
  SETDATA: 'Set Data',
  ENCRYPT: 'Encrypt',
  DECRYPT: 'Decrypt',
  SIGN: 'Sign',
  EXECUTE_RELAY_CALL: 'Execute Relay Call',
  ERC4337_PERMISSION: 'ERC4337 Permission',
}

export const CALL_TYPES: Record<number, string> = {
  1: 'CALL',
  2: 'STATICCALL',
  4: 'DELEGATECALL',
  8: 'VALUE',
}

/**
 * Known LUKSO contract addresses mapped to their labels.
 * These are implementation contracts, not Universal Profiles.
 */
export const KNOWN_CONTRACTS: Record<string, { label: string; fullName: string }> = {
  // LSP1 Universal Receiver Delegate implementations
  '0x7870c5b8bc9572a8001c3f96f7ff59961b23500d': {
    label: 'URD',
    fullName: 'Universal Receiver Delegate (LSP1) v0.14.0',
  },
  '0xa5467dfe7019bf2c7c5f7a707711b9d4cad118c8': {
    label: 'URD',
    fullName: 'Universal Receiver Delegate (LSP1) v0.12.1',
  },
  // LSP6 Key Manager implementations
  '0xa75684d7d048704a2db851d05ba0c3cbe226264c': {
    label: 'Key Manager',
    fullName: 'LSP6 Key Manager v0.12.1',
  },
  '0x2fe3aed98684e7351ad2d408a43ce09a738bf8a4': {
    label: 'Key Manager',
    fullName: 'LSP6 Key Manager v0.14.0',
  },
}
