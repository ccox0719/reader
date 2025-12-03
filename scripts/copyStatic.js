const fs = require("fs");
const path = require("path");

const ROOT_FILES = ["index.html", "main.js", "styles.css"];
const SOURCE_DIR = path.resolve(__dirname, "..");
const TARGET_DIR = path.join(SOURCE_DIR, "dist");

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

for (const fileName of ROOT_FILES) {
  const sourcePath = path.join(SOURCE_DIR, fileName);
  const targetPath = path.join(TARGET_DIR, fileName);
  if (!fs.existsSync(sourcePath)) continue;
  fs.copyFileSync(sourcePath, targetPath);
}

const copyDir = (name) => {
  const source = path.join(SOURCE_DIR, name);
  const dest = path.join(TARGET_DIR, name);
  if (!fs.existsSync(source)) return;
  const copyRecursive = (src, dst) => {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst);
      }
      for (const entry of fs.readdirSync(src)) {
        copyRecursive(path.join(src, entry), path.join(dst, entry));
      }
    } else {
      fs.copyFileSync(src, dst);
    }
  };
  copyRecursive(source, dest);
};

copyDir("assets");
