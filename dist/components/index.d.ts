import { QuartzComponent, FullSlug, FilePath } from '@quartz-community/types';

/** Frontmatter property that holds the icon path, relative to the note. */
declare const PAGE_ICON_PROPERTY = "page_icon";
/**
 * Turn a page_icon value into the URL of the emitted image, relative to the page's own URL.
 *
 * The image is resolved against the note's folder and slugified the same way Quartz's Assets
 * emitter names the copied file, so `notes/icons/My Icon.png` becomes `notes/icons/my-icon.png`.
 * Returns null when the path points outside the content folder, since Quartz never emits it.
 */
declare function resolvePageIcon(slug: FullSlug, relativePath: FilePath, iconPath: string): string | null;
declare const _default: () => QuartzComponent;

export { _default as ArticleTitle, PAGE_ICON_PROPERTY, resolvePageIcon };
