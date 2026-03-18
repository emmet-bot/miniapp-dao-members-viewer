export const RPC_URLS: Record<number, string> = {
  42: 'https://42.rpc.thirdweb.com',
  4201: 'https://4201.rpc.thirdweb.com',
}

export const CHAIN_NAMES: Record<number, string> = {
  42: 'Mainnet',
  4201: 'Testnet',
}

export const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs/'

export const DATA_KEYS = {
  AddressPermissionsArray:
    '0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3',
  AddressPermissionsPrefix: '0x4b80742de2bf82acb3630000',
  PermissionsPrefix: '0x4b80742de2bf393a64c70000',
  AllowedCallsPrefix: '0x4b80742de2bf866c29110000',
  AllowedERC725YDataKeysPrefix: '0x4b80742de2bf90b8b4850000',
  LSP3Profile:
    '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
} as const

export const PERMISSIONS: Record<string, bigint> = {
  CHANGEOWNER: 1n << 0n,
  ADDCONTROLLER: 1n << 1n,
  EDITPERMISSIONS: 1n << 2n,
  ADDEXTENSIONS: 1n << 3n,
  CHANGEEXTENSIONS: 1n << 4n,
  ADDUNIVERSALRECEIVERDELEGATE: 1n << 5n,
  CHANGEUNIVERSALRECEIVERDELEGATE: 1n << 6n,
  REENTRANCY: 1n << 7n,
  SUPER_TRANSFERVALUE: 1n << 8n,
  TRANSFERVALUE: 1n << 9n,
  SUPER_CALL: 1n << 10n,
  CALL: 1n << 11n,
  SUPER_STATICCALL: 1n << 12n,
  STATICCALL: 1n << 13n,
  SUPER_DELEGATECALL: 1n << 14n,
  DELEGATECALL: 1n << 15n,
  DEPLOY: 1n << 16n,
  SUPER_SETDATA: 1n << 17n,
  SETDATA: 1n << 18n,
  ENCRYPT: 1n << 19n,
  DECRYPT: 1n << 20n,
  SIGN: 1n << 21n,
  EXECUTE_RELAY_CALL: 1n << 22n,
}

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
}

export const CALL_TYPES: Record<number, string> = {
  1: 'CALL',
  2: 'STATICCALL',
  4: 'DELEGATECALL',
  8: 'VALUE',
}
