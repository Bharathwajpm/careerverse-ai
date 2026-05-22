import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const clientDir = path.join(root, "dist", "client");
const serverDir = path.join(root, "dist", "server");
const assetsDir = path.join(clientDir, "assets");
const indexHtml = path.join(clientDir, "index.html");

function fail(message) {
  console.error(`[build:validate] ${message}`);
  process.exit(1);
}

function pickAsset(assets, prefix, ext) {
  const matches = assets.filter((f) => f.startsWith(prefix) && f.endsWith(ext));
  if (!matches.length) return null;
  return matches.sort((a, b) => {
    const sa = fs.statSync(path.join(assetsDir, a)).size;
    const sb = fs.statSync(path.join(assetsDir, b)).size;
    return sb - sa;
  })[0];
}

if (!fs.existsSync(clientDir)) {
  fail("Missing dist/client — run npm run build first.");
}

if (!fs.existsSync(assetsDir)) {
  fail("Missing dist/client/assets.");
}

const assets = fs.readdirSync(assetsDir);
const hasJs = assets.some((f) => f.endsWith(".js"));
const hasCss = assets.some((f) => f.endsWith(".css"));

if (!hasJs) fail("No JS assets in dist/client/assets.");
if (!hasCss) fail("No CSS assets in dist/client/assets.");

if (!fs.existsSync(serverDir)) {
  fail("Missing dist/server — SSR/worker bundle required for TanStack Start.");
}

const mainJs = pickAsset(assets, "index-", ".js") ?? pickAsset(assets, "", ".js");
const mainCss = pickAsset(assets, "styles-", ".css") ?? assets.find((f) => f.endsWith(".css"));

if (!mainJs) fail("Could not detect main JS entry in dist/client/assets.");

if (!fs.existsSync(indexHtml)) {
  const html = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="CareerVerse AI — career operating system for students" />
    <title>CareerVerse AI</title>
    ${mainCss ? `<link rel="stylesheet" href="/assets/${mainCss}" />` : ""}
  </head>
  <body class="font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/assets/${mainJs}"></script>
  </body>
</html>
`;
  fs.writeFileSync(indexHtml, html, "utf8");
  console.log(`[build:validate] Generated dist/client/index.html → /assets/${mainJs}`);
}

const sizeMb =
  assets.reduce((sum, file) => sum + fs.statSync(path.join(assetsDir, file)).size, 0) / (1024 * 1024);

console.log(`[build:validate] OK — ${assets.length} assets (${sizeMb.toFixed(2)} MB), server bundle present`);
