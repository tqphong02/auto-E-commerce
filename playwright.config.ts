import { defineConfig } from "@playwright/test";
import { storageStatePath } from "./utils/session";
import fs from "fs";

const storageState = fs.existsSync(storageStatePath)
  ? storageStatePath
  : undefined;

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    ignoreHTTPSErrors: true,
    storageState,
  },
});
