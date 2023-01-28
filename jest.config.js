module.exports = {
  clearMocks: true,
  // preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/api/setup.ts"],
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true,
      },
      // tsconfig: {
      //   jsx: "preserve",
      // },
      tsconfig: "<rootDir>/tsconfig.json",
      babelConfig: "<rootDir>/.babelrc",
      useESM: true,
    },
  },
};
