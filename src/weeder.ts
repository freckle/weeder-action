import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as path from "path";
import * as tc from "@actions/tool-cache";
import semver from "semver";

import { type Weed, parseWeeds } from "./weed.js";

export async function runWeeder(
  ghcVersion: string,
  args: string[],
  cwd: string,
): Promise<Weed[]> {
  const weeder = await core.group("Install weeder", async () => {
    return await installWeeder(ghcVersion);
  });

  const version = await core.group("Get weeder version", async () => {
    const version = await getWeederVersion(weeder);
    core.info(`Using weeder v${version}`);
    return version;
  });

  const { exitCode, weeds } = await core.group("Run weeder", async () => {
    return await execWeeder(weeder, args, { cwd });
  });

  const trustExitCode = semver.gte(version, "2.7.0");
  const weedsFound = trustExitCode ? exitCode === 228 : weeds.length > 0;

  core.debug(`Weeder exited with code ${exitCode}`);
  core.debug(`Trusting that to indicate weeds? ${trustExitCode}`);
  core.debug(`Parsed ${weeds.length} weed(s) from stdout`);

  if (exitCode !== 0 && !weedsFound) {
    throw new Error("Weeder encountered a non-weeds error");
  }

  return weeds;
}

const ARTIFACT_PREFIX =
  "https://github.com/freckle/weeder-action/releases/download/Binaries";

async function installWeeder(ghcVersion: string): Promise<string> {
  const { platform: os, arch } = process;
  const [ext, extract] =
    os === "win32" ? [`zip`, tc.extractZip] : [`tar.gz`, tc.extractTar];
  const url = `${ARTIFACT_PREFIX}/weeder-${ghcVersion}-${os}-${arch}.${ext}`;
  const archive = await tc.downloadTool(url);
  const temp = await extract(archive);
  return path.join(temp, "weeder");
}

async function getWeederVersion(weeder: string): Promise<string> {
  const { exitCode, stdout } = await exec.getExecOutput(weeder, ["--version"]);

  if (exitCode !== 0) {
    throw new Error(`weeder --version failed with exit code ${exitCode}`);
  }

  return cleanWeederVersion(stdout);
}

// extracted for testing
export function cleanWeederVersion(input: string): string {
  const prefix = /^weeder version /;
  const version = input
    .split("\n")
    .filter((line) => line.match(prefix))
    .map((line) => line.replace(prefix, "").trim())
    .join();

  if (semver.valid(version)) {
    return version;
  }

  throw new Error(`Could not parse weeder version from: ${input}`);
}

async function execWeeder(
  weeder: string,
  args: string[],
  opts: exec.ExecOptions,
): Promise<{ exitCode: number; weeds: Weed[] }> {
  opts.ignoreReturnCode = true;
  const { exitCode, stdout } = await exec.getExecOutput(weeder, args, opts);
  const weeds = parseWeeds(stdout);
  return { exitCode, weeds };
}
