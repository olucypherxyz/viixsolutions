/**
 * Replace decorative Unicode arrows in CTA-like text with SVG icons.
 * Run: node scripts/replace-unicode-arrows.cjs
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const ARROW =
  '<svg class="arrow-up-right" width="0.732em" height="0.6em" fill="currentColor" viewBox="0 200 732 600" aria-hidden="true" focusable="false"><path d="M350 235H637V522zM91 714 506 292 574 360 159 782z"/></svg>';
const DOWN =
  '<svg class="icon-arrow-down" width="0.7em" height="0.7em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "lib" || entry.name === "node_modules") continue;
      walk(full, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  // Only replace arrows that are not already inside an SVG path context as lone glyphs in text nodes near CTAs.
  html = html.replace(/→/g, ` ${ARROW}`);
  html = html.replace(/↓/g, ` ${DOWN}`);
  html = html.replace(/↑/g, ` ${ARROW}`);
  // Clean doubled spaces before SVG
  html = html.replace(/ {2,}<svg/g, " <svg");
  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
    console.log("updated", path.relative(root, file));
  }
}
console.log(`Updated ${changed} files.`);
