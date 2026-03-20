export const RPC_URLS: Record<number, string> = {
  42: 'https://42.rpc.thirdweb.com',
  4201: 'https://4201.rpc.thirdweb.com',
}

export const CHAIN_NAMES: Record<number, string> = {
  42: 'Mainnet',
  4201: 'Testnet',
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
