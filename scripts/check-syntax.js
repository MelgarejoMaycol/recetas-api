const { readdirSync } = require("fs");
const { join } = require("path");
const { spawnSync } = require("child_process");

const ignoredDirs = new Set([".git", ".github", "node_modules"]);
const files = [];

const collectJsFiles = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        collectJsFiles(join(dir, entry.name));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(join(dir, entry.name));
    }
  }
};

collectJsFiles(process.cwd());

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log(`Syntax OK (${files.length} archivos JS)`);
