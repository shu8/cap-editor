module.exports = {
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/api/setup.ts"],
};
