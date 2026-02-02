import { createDefaultPreset, type JestConfigWithTsJest } from "ts-jest";

const presetConfig = createDefaultPreset({
  isolatedModules: true,
  useESM: true,
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  resetMocks: true,
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default jestConfig;
