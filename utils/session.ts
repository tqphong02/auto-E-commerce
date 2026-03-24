// Reusable session utilities
// - `storageStatePath` is where the authenticated state is saved by the setup test
// - Import this path in your tests or set `use.storageState` in playwright.config.ts
export const storageStatePath = "storageState.json";

export function storageStateFile() {
  return storageStatePath;
}
