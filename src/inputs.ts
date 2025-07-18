import * as core from "@actions/core";

export type inputs = {
  ghcVersion: string;
  weederArguments: string[];
  workingDirectory: string;
  fail: boolean;
};

export function getInputs(): inputs {
  return {
    ghcVersion: core.getInput("ghc-version", { required: true }),
    weederArguments: core.getMultilineInput("weeder-arguments", {
      required: true,
    }),
    workingDirectory: core.getInput("working-directory", { required: true }),
    fail: core.getBooleanInput("fail", { required: true }),
  };
}
