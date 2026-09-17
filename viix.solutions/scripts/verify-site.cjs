// Dependency-free checks for the static site's routes, assets and SEO landmarks.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((item) =>
      item.isDirectory()
        ? walk(path.join(dir, item.name))
        : [path.join(dir, item.name)],
    );
}
const pages = walk(root).filter((file) => file.endsWith(".html"));
const failures = [];
let links = 0;
function check(condition, message) {
  if (!condition) failures.push(message);
}
function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)].map((m) => [m[1], m[2]]),
  );
}
for (const file of pages) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  const html = fs.readFileSync(file, "utf8");
  const route =
    "/" +
    rel
      .replace(/index\.html$/, "")
      .replace(/\.html$/, "")
      .replace(/\/$/, "");
  check(
    (html.match(/<main\b/g) || []).length === 1,
    `${rel}: expected one main landmark`,
  );
  check((html.match(/<h1\b/g) || []).length === 1, `${rel}: expected one h1`);
  check(html.includes('id="main-content"'), `${rel}: missing skip-link target`);
  const tags = [...html.matchAll(/<(?:a|link|img|script|form)\b[^>]*>/g)].map(
    (m) => m[0],
  );
  const canonical = tags.map(attributes).find((a) => a.rel === "canonical");
  if (rel !== "404.html")
    check(
      canonical?.href === `https://www.viix.solutions${route}`,
      `${rel}: canonical does not match route`,
    );
  const robots = [...html.matchAll(/<meta\b[^>]*>/g)]
    .map((m) => attributes(m[0]))
    .find((a) => a.name === "robots");
  const noindex = ["404.html", "portfolio/posflyt.html"].includes(rel);
  check(
    noindex === !!robots?.content?.includes("noindex"),
    `${rel}: unexpected indexing directive`,
  );
  for (const match of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${rel}: invalid structured data`);
    }
  }
  for (const tag of tags) {
    const attrs = attributes(tag);
    if (attrs.rel && !["stylesheet", "icon"].includes(attrs.rel)) continue;
    const href = attrs.href || attrs.src || attrs.action;
    if (!href || /^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
    links++;
    const [url, fragment] = href.split("#");
    const pathname = url.split("?")[0];
    const target = pathname
      ? path.resolve(
          pathname.startsWith("/") ? root : path.dirname(file),
          "." + (pathname.startsWith("/") ? pathname : "/" + pathname),
        )
      : file;
    const candidates = [
      target,
      target + ".html",
      path.join(target, "index.html"),
    ];
    const resolved = candidates.find(
      (candidate) =>
        fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
    );
    check(!!resolved, `${rel}: broken local reference ${href}`);
    if (resolved && fragment) {
      const targetHtml = fs.readFileSync(resolved, "utf8");
      check(
        targetHtml.includes(`id="${fragment}"`),
        `${rel}: missing fragment ${href}`,
      );
    }
  }
  for (const match of html
    .replaceAll("&quot;", '"')
    .matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    const url = match[1];
    if (/^(https?:|data:|#)/.test(url)) continue;
    const target = path.resolve(
      url.startsWith("/") ? root : path.dirname(file),
      "." + (url.startsWith("/") ? url : "/" + url),
    );
    check(fs.existsSync(target), `${rel}: missing background image ${url}`);
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `PASS: ${pages.length} pages; ${links} local references; landmarks, canonical URLs, indexing directives, structured data and background images.`,
  );
