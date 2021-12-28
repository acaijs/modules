const { promises: fs } = require("fs");
const { exec } = require("child_process");

const colors = {
  red: `\x1b[31m`,
  green: `\x1b[32m`,
  yellow: `\x1b[33m`,
  blue: `\x1b[34m`,
  magenta: `\x1b[35m`,
  cyan: `\x1b[36m`,
  white: `\x1b[37m`
};

exports.exists = (path) => fs.stat(path).then(() => true).catch(() => false)

exports.colored = (message, color) => {
  console.log(colors[color || "white"] + message + "\x1b[0m");
};

exports.exception = (message) => {
  exports.colored(message, "red");
  process.exit(1);
};

exports.cli = (command) => {
  return new Promise((resolve, reject) =>
    exec(command, (error, stdout, sterr) =>
      error || sterr ? reject(error || sterr) : resolve(stdout)
    )
  );
};

const stageBump = (stage, stageVer) => {
  if (!stage) return "";

  if (stageVer) {
    return `-${stage}.${stageVer}`;
  }

  return `-${stage}`;
};

const nextBump = (major, minor, patch, stage, stageVer) => (type) =>
  ({
    major: `${major + 1}.${0}.${0}`,
    minor: `${major}.${minor + 1}.${0}`,
    patch: `${major}.${minor}.${patch + 1}`,
    "major beta": `${major + 1}.${0}.${0}${stageBump(
      "beta",
      stage === "beta" ? (stageVer || 0) + 1 : 0
    )}`,
    "minor beta": `${major}.${minor + 1}.${0}${stageBump(
      "beta",
      stage === "beta" ? (stageVer || 0) + 1 : 0
    )}`,
    "major alpha": `${major + 1}.${0}.${0}${stageBump(
      "alpha",
      stage === "alpha" ? (stageVer || 0) + 1 : 0
    )}`,
    "minor alpha": `${major}.${minor + 1}.${0}${stageBump(
      "alpha",
      stage === "alpha" ? (stageVer || 0) + 1 : 0
    )}`
  }[type]);

exports.bump = (current, type) => {
  const [mainVer, stableVer] = current.split("-");
  const [major, minor, patch] = mainVer.split(".");
  const [stage, stageVer] = (stableVer || "").split(".");

  if (
    !(major && minor && patch) ||
    !(major.match(/\d/) && minor.match(/\d/) && patch.match(/\d/)) ||
    (stage &&
      (!["alpha", "beta"].includes(stage) ||
        (stageVer && !stageVer.match(/\d/))))
  ) {
    exports.exception(`Version ${current} is malformed`);
  }

  return nextBump(
    parseInt(major, 10),
    parseInt(minor, 10),
    parseInt(patch, 10),
    stage,
    parseInt(stageVer, 10)
  )(type);
};
