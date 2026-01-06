/**
 * Jest Setup File
 * Configures the test environment before running tests
 */

import path from "node:path";
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// Load local env if available (for secrets)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Suppress console errors and warnings during tests (optional)
// const originalError = console.error;
// const originalWarn = console.warn;

// beforeAll(() => {
// console.error = (...args) => {
//   if (
//     typeof args[0] === 'string' &&
//     (args[0].includes('Warning: ReactDOM.render') ||
//      args[0].includes('Warning: useLayoutEffect'))
//   ) {
//     return;
//   }
//   originalError.call(console, ...args);
// };
// console.warn = (...args) => {
//   if (
//     typeof args[0] === 'string' &&
//     args[0].includes('Warning:')
//   ) {
//     return;
//   }
//   originalWarn.call(console, ...args);
// };
// });

// afterAll(() => {
// console.error = originalError;
// console.warn = originalWarn;
// });
