import fs from "node:fs";
import path from "node:path";
import type {
  FilePath,
  FullSlug,
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { joinSegments, pathToRoot, slugifyFilePath } from "@quartz-community/utils/path";
import { classNames } from "../util/lang";

/** Frontmatter property that holds the icon path, relative to the note. */
export const PAGE_ICON_PROPERTY = "page_icon";

/**
 * Turn a page_icon value into the URL of the emitted image, relative to the page's own URL.
 *
 * The image is resolved against the note's folder and slugified the same way Quartz's Assets
 * emitter names the copied file, so `notes/icons/My Icon.png` becomes `notes/icons/my-icon.png`.
 * Returns null when the path points outside the content folder, since Quartz never emits it.
 */
export function resolvePageIcon(
  slug: FullSlug,
  relativePath: FilePath,
  iconPath: string,
): string | null {
  const assetPath = path.posix.join(path.posix.dirname(relativePath), iconPath);
  if (assetPath === ".." || assetPath.startsWith("../")) {
    return null;
  }
  return joinSegments(pathToRoot(slug), slugifyFilePath(assetPath as FilePath));
}

function getIconSrc({ fileData }: QuartzComponentProps): string | null {
  const raw = fileData.frontmatter?.[PAGE_ICON_PROPERTY];
  if (typeof raw !== "string" || raw.trim() === "") {
    return null;
  }

  const iconPath = raw.trim();
  const { slug, filePath, relativePath } = fileData;
  if (!slug || !filePath || !relativePath) {
    return null;
  }

  const src = resolvePageIcon(slug, relativePath, iconPath);
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

const ArticleTitle: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, displayClass } = props;
  const title = (fileData.frontmatter as { title?: string } | undefined)?.title;
  if (title) {
    const iconSrc = getIconSrc(props);
    return (
      <h1 class={classNames(displayClass, "article-title")}>
        {iconSrc && <img class="page-icon" src={iconSrc} alt="" />}
        {title}
      </h1>
    );
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

export default (() => ArticleTitle) satisfies QuartzComponentConstructor;
