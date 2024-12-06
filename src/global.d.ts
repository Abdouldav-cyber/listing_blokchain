// global.d.ts
declare global {
    interface Window {
      ethereum?: {
        isMetaMask?: boolean;
        request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      };
    }
  }
  
  export {};
  