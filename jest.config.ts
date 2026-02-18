import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "__tests__"],
  moduleFileExtensions: ["ts", "js"],
  resolver: "ts-jest-resolver",
  verbose: true,
  clearMocks: true,
};

export default config;
