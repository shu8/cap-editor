/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  projects: [
    {
      testEnvironment: "node",
      testMatch: ["**/tests/api/**/*.test.ts"],
      setupFilesAfterEnv: ["<rootDir>/tests/api/setup.ts"],
    },
    {
      testEnvironment: "jsdom",
      testMatch: ["**/tests/frontend/**/*.test.tsx"],
      moduleNameMapper: {
        "\\.css$": "identity-obj-proxy",
      },
      transformIgnorePatterns: ["/node_modules/(?!ol)/"],
      setupFiles: ["<rootDir>/tests/frontend/setup.ts"],
      globalSetup: "<rootDir>/tests/frontend/global-setup.ts",
    },
    {
      setupFilesAfterEnv: ["<rootDir>/tests/e2e/setup.ts"],
      testEnvironment: "<rootDir>/tests/e2e/puppeteer-environment.ts",
      testMatch: ["**/tests/e2e/**/*.test.ts"],
    },
  ],
};
