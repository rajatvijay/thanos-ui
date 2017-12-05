"use strict";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs");
const { exec, spawnSync } = require("child_process");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let gitDiff = spawnSync("git", [
  "diff-index",
  "--cached",
  "--name-only",
  "HEAD"
]);
let output = gitDiff.stdout.toString().trim();
let fileList = null;
let results = [];
if (output) {
  fileList = output.split(/\r?\n/);
}

results.push(yarnCheck(fileList));
if (
  results.some(function(x) {
    return x;
  })
) {
  return 1;
}
results.push(prettyFormat(fileList));

function prettyFormat(fileList) {
  // Remove files without extension .js, .jsx, .less, .css, .scss
  let updatedFileList = fileList.filter(file =>
    /(\.js|\.jsx|\.css|\.scss|\.less)$/.test(file)
  );
  if (!fileList) return false;
  let hasErrors = false;

  let status = spawnSync("prettier", ["--write", ...fileList]);
  hasErrors = status.error ? true : false;
  if (hasErrors) return false;

  output = spawnSync("git", ["diff", ...fileList]);
  if (output.stdout) {
    output = output.stdout
      .toString()
      .trim()
      .split(/\r?\n/);
    console.log("[krypton.lint] applied changes from autoformatting");
    output.forEach(line => {
      if (line.startsWith("-")) console.log("\x1b[31m", line, "\x1b[0m");
      else if (line.startsWith("+")) console.log("\x1b[32m", line, "\x1b[0m");
      else console.log(line);
    });
    rl.question('Stage this patch and continue? [Y/n] ', (answer) => {
      if (answer.trim().toLowerCase() !== 'y'){
        console.error('[krypton.lint] Aborted! Changes have been applied but not staged.');
        process.exit(1);
      }
    });
    status = spawnSync('git', ['update-index', '--add', ...file_list])
    hasErrors = status.error ? true : false;
    return hasErrors
  }
}

function yarnCheck(fileList) {
  /*
    Check if package.json was modified WITHOUT a corresponding change in the Yarn\n
    lockfile. This can happen if a user manually edited package.json without running Yarn.

    This is a user prompt right now because there ARE cases where you can touch package.json
    without a Yarn lockfile change, e.g. Jest config changes, license changes, etc.
    */
  let warningText = `Warning: package.json modified without accompanying yarn.lock modifications.
    
    If you updated a dependency/devDependency in package.json, you must run \`yarn instal\` to update the lockfile.
    
    To skip this check, run:
    
    $ SKIP_YARN_CHECK=1 git commit [options]`;
  if (fileList === null || process.env.SKIP_YARN_CHECK) return false;

  if (
    fileList.indexOf("package.json") > -1 &&
    fileList.indexOf("yarn.lock") == -1
  ) {
    console.log("\x1b[33m", warningText, "\x1b[0m");
    return true;
  }
  return false;
}
