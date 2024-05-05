module.exports = {
  testEnvironment: "node",

  testMatch: ["<rootDir>/tests/*.test.js"],

  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // reporters: ["default", "jest-junit"],
  testTimeout: 15000,

  // coveragePathIgnorePatterns: [
  //   "/node_modules/",
  //   "/tests/",
  //   "/coverage/",
  //   "/build/",
  //   "/dist/",
  // ],
};
