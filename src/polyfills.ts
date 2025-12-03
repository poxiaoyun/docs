import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

// Polyfill Buffer for browser environment
(globalThis as any).Buffer = (globalThis as any).Buffer || Buffer;
