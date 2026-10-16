import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render } from "preact-render-to-string";
import type { FilePath, FullSlug, QuartzComponentProps } from "@quartz-community/types";
import ArticleTitle, { resolvePageIcon } from "../src/components/ArticleTitle";

describe("resolvePageIcon", () => {
  it("resolves a sibling file for a root-level note", () => {
    expect(resolvePageIcon("note" as FullSlug, "note.md" as FilePath, "icon.png")).toBe(
      "./icon.png",
    );
  });

  it("resolves relative to the note's folder", () => {
    expect(
      resolvePageIcon("notes/foo" as FullSlug, "notes/foo.md" as FilePath, "./icons/a.png"),
    ).toBe("../notes/icons/a.png");
  });

  it("resolves parent-folder paths", () => {
    expect(
      resolvePageIcon("a/b/note" as FullSlug, "a/b/note.md" as FilePath, "../../assets/x.png"),
    ).toBe("../../assets/x.png");
  });

  it("slugifies the asset path the same way the Assets emitter does", () => {
    expect(
      resolvePageIcon(
        "notes/foo" as FullSlug,
        "notes/foo.md" as FilePath,
        "My Icons/Cool Icon.png",
      ),
    ).toBe("../notes/my-icons/cool-icon.png");
  });

  it("works for folder index pages", () => {
    expect(
      resolvePageIcon("notes/index" as FullSlug, "notes/index.md" as FilePath, "icon.png"),
    ).toBe("../notes/icon.png");
  });

  it("rejects paths that leave the content folder", () => {
    expect(resolvePageIcon("note" as FullSlug, "note.md" as FilePath, "../icon.png")).toBeNull();
  });
});

describe("ArticleTitle component", () => {
  let contentDir: string;

  beforeAll(() => {
    contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "article-title-"));
    fs.mkdirSync(path.join(contentDir, "notes"));
    fs.writeFileSync(path.join(contentDir, "notes", "icon.png"), "");
  });

  afterAll(() => {
    fs.rmSync(contentDir, { recursive: true, force: true });
  });

  const renderTitle = (frontmatter: Record<string, unknown>) => {
    const props = {
      fileData: {
        slug: "notes/foo",
        relativePath: "notes/foo.md",
        filePath: path.join(contentDir, "notes", "foo.md"),
        frontmatter,
      },
      displayClass: undefined,
    } as unknown as QuartzComponentProps;
    return render(ArticleTitle()(props) as preact.VNode);
  };

  it("renders the icon before the title", () => {
    expect(renderTitle({ title: "Foo", page_icon: "icon.png" })).toBe(
      '<h1 class="article-title"><img class="page-icon" src="../notes/icon.png" alt/>Foo</h1>',
    );
  });

  it("renders a plain title without page_icon", () => {
    expect(renderTitle({ title: "Foo" })).toBe('<h1 class="article-title">Foo</h1>');
  });

  it("skips and warns about a missing icon file", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(renderTitle({ title: "Foo", page_icon: "missing.png" })).toBe(
      '<h1 class="article-title">Foo</h1>',
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("missing.png"));
    warn.mockRestore();
  });

  it("ignores non-string values", () => {
    expect(renderTitle({ title: "Foo", page_icon: ["icon.png"] })).toBe(
      '<h1 class="article-title">Foo</h1>',
    );
  });

  it("renders nothing without a title", () => {
    expect(renderTitle({ page_icon: "icon.png" })).toBe("");
  });

  it("ships css", () => {
    expect(ArticleTitle().css).toContain(".page-icon");
  });
});
