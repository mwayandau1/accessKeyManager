module.exports = {
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  reporters: ["default", "jest-junit"],
  testTimeout: 10000,

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/",
    "/coverage/",
    "/build/",
    "/dist/",
  ],
};
