/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'ethereum-blockies-base64' {
  function makeBlockie(address: string): string
  export default makeBlockie
}

declare module '@lukso/web-components' {}
