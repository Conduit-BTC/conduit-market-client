export const DEFAULT_RELAYS = import.meta.env.DEV
  ? ['ws://localhost:7777']
  : ['wss://relay.conduit.market']
