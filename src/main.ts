import * as core from "@actions/core";
import * as fs from "fs";
import temp from "temp";

import { getInputs } from "./inputs";
import { runWeeder } from "./weeder";

async function run() {
  try {
    const inputs = getInputs();
    const weeds = await runWeeder(
      inputs.ghcVersion,
      inputs.weederArguments,
      inputs.workingDirectory,
    );

    const log = await temp.path({ suffix: ".json" });

    await core.group("Logging weeds data", async () => {
      core.info(`Writing weeds data to ${log}`);
      fs.writeFileSync(log, JSON.stringify(weeds));
      core.setOutput("log", log);
    });

    if (weeds.length > 0) {
      weeds.forEach((weed) => {
        const file = `${inputs.workingDirectory}/${weed.file}`;
        const startLine = weed.line;
        const message = `${weed.identifier} is not used by any defined root`;
        core.error(message, { file, startLine });
      });

      if (inputs.fail) {
        core.setFailed("Weeds found");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else if (typeof error === "string") {
      core.setFailed(error);
    } else {
      core.setFailed("Non-Error exception");
    }
  }
}

run();
