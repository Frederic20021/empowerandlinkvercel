import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PostMarkdown } from "./PostMarkdown";
import { resolveBlogImage } from "./images";

const render = (md: string) => renderToStaticMarkup(<PostMarkdown source={md} />);

describe("resolveBlogImage", () => {
  it("allows local blog images and GitHub raw URLs only", () => {
    expect(resolveBlogImage("/images/blog/a.jpg")?.kind).toBe("local");
    expect(resolveBlogImage("/images/blog/%E6%8E%A5.png")?.kind).toBe("local");
    expect(resolveBlogImage("https://raw.githubusercontent.com/o/r/main/a.png")?.kind).toBe("github");
    for (const s of ["https://evil.test/a.png", "http://raw.githubusercontent.com/a.png", "/images/other/a.png", "/images/blog/../x.png", "//evil.test/a.png", "data:image/png;base64,AA", "", undefined]) {
      expect(resolveBlogImage(s)).toBeNull();
    }
  });
});

describe("PostMarkdown", () => {
  it("renders local images as figures through next/image", () => {
    const html = render("text\n![](/images/blog/a.jpg)\nmore");
    expect(html).toContain("<figure>");
    expect(html).toContain("/_next/image?url=%2Fimages%2Fblog%2Fa.jpg");
  });
  it("keeps GitHub raw images as plain img", () => {
    const html = render("![x](https://raw.githubusercontent.com/o/r/main/public/images/blog/a.png)");
    expect(html).toContain('src="https://raw.githubusercontent.com/o/r/main/public/images/blog/a.png"');
  });
  it("drops remote non-GitHub images", () => {
    const html = render("![x](https://evil.test/a.png)\n\ninline ![y](https://evil.test/b.png) end");
    expect(html).not.toContain("evil.test");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<figure");
  });
  it("does not render raw HTML or javascript: links", () => {
    const html = render('<script>alert(1)</script>\n\n[x](javascript:alert(1))');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
  });
  it("turns middle-dot lines into a list", () => {
    const html = render("見出し\n\n・一つ目\n\n・二つ目\n\n本文");
    expect(html).toContain("<ul>");
    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html).toContain("一つ目");
    expect(html).not.toContain("・");
  });
  it("opens external links safely", () => {
    expect(render("[a](https://example.com)")).toContain('target="_blank" rel="noopener noreferrer"');
  });
});
