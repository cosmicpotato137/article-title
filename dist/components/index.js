import fs from 'fs';
import path from 'path';

// src/components/ArticleTitle.tsx

// node_modules/@quartz-community/utils/dist/path.js
function slugifyFilePath(fp, excludeExt) {
  fp = stripSlashes(fp);
  const ext = getFileExtension(fp);
  const withoutFileExt = fp.replace(new RegExp(ext + "$"), "");
  const finalExt = [".md", ".html", void 0].includes(ext) ? "" : ext;
  let slug2 = _sluggify(withoutFileExt);
  if (endsWith(slug2, "_index")) {
    slug2 = slug2.replace(/_index$/, "index");
  }
  const segments = slug2.split("/");
  if (segments.length >= 2 && segments[segments.length - 1] === segments[segments.length - 2]) {
    segments[segments.length - 1] = "index";
    slug2 = segments.join("/");
  }
  return slug2 + (finalExt ?? "");
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s2, suffix) {
  return s2 === suffix || s2.endsWith("/" + suffix);
}
function stripSlashes(s2, onlyStripPrefix) {
  if (s2.startsWith("/")) {
    s2 = s2.substring(1);
  }
  if (s2.endsWith("/")) {
    s2 = s2.slice(0, -1);
  }
  return s2;
}
function getFileExtension(s2) {
  return s2.match(/\.[A-Za-z0-9]+$/)?.[0];
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_2) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function slugifyPath(s2) {
  return s2.split("/").map(
    (segment) => segment.replace(/\s/g, "-").replace(/&/g, "-and-").replace(/%/g, "-percent").replace(/\?/g, "").replace(/#/g, "").replace(/[<>:"|*]/g, "").toLowerCase()
  ).join("/").replace(/\/$/, "");
}
function _sluggify(s2) {
  return slugifyPath(s2);
}

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/ArticleTitle.tsx
var PAGE_ICON_PROPERTY = "page_icon";
function resolvePageIcon(slug2, relativePath, iconPath) {
  const assetPath = path.posix.join(path.posix.dirname(relativePath), iconPath);
  if (assetPath === ".." || assetPath.startsWith("../")) {
    return null;
  }
  return joinSegments(pathToRoot(slug2), slugifyFilePath(assetPath));
}
function getIconSrc({ fileData }) {
  const raw = fileData.frontmatter?.[PAGE_ICON_PROPERTY];
  if (typeof raw !== "string" || raw.trim() === "") {
    return null;
  }
  const iconPath = raw.trim();
  const { slug: slug2, filePath, relativePath } = fileData;
  if (!slug2 || !filePath || !relativePath) {
    return null;
  }
  const src = resolvePageIcon(slug2, relativePath, iconPath);
  if (!src) {
    console.warn(`[article-title] ${relativePath}: "${iconPath}" is outside the content folder`);
    return null;
  }
  if (!fs.existsSync(path.join(path.dirname(filePath), iconPath))) {
    console.warn(`[article-title] ${relativePath}: icon "${iconPath}" not found`);
    return null;
  }
  return src;
}
var ArticleTitle = (props) => {
  const { fileData, displayClass } = props;
  const title = fileData.frontmatter?.title;
  if (title) {
    const iconSrc = getIconSrc(props);
    return /* @__PURE__ */ u2("h1", { class: classNames(displayClass, "article-title"), children: [
      iconSrc && /* @__PURE__ */ u2("img", { class: "page-icon", src: iconSrc, alt: "" }),
      title
    ] });
  } else {
    return null;
  }
};
ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}

.article-title .page-icon {
  height: 1.5em;
  width: auto;
  margin: 0 0.35em 0 0;
  border-radius: 0;
  vertical-align: -0.25em;
}
`;
var ArticleTitle_default = (() => ArticleTitle);

export { ArticleTitle_default as ArticleTitle, PAGE_ICON_PROPERTY, resolvePageIcon };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map