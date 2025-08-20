// src/polyfills.ts
// 일부 패키지가 브라우저에서 Node 전역을 기대할 때 대비
// sockjs-client의 browser-crypto 등에서 global/process를 참조
(window as any).global = window;
(window as any).process = (window as any).process || { env: {} };
