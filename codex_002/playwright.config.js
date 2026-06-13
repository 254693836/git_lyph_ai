const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./webapp/test/e2e",
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: true,
    timeout: 120000
  }
});
