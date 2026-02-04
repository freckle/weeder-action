import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const presetConfig = createDefaultEsmPreset();

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  resetMocks: true,
  testEnvironment: "node",
};

export default jestConfig;
