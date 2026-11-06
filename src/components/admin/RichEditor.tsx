"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { marked } from "marked";
import TurndownService from "turndown";
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadImage } from "./api";
import "./admin.css";

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
turndown.addRule("strike", { filter: ["del", "s"], replacement: (content) => `~~${content}~~` });

export type RichEditorHandle = {
  /** Markdown of the current content, with upload preview URLs mapped back to /images/blog paths. */
  getMarkdown(): string;
};

function ToolbarButton({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cn(
        "grid size-9 cursor-pointer place-items-center rounded-md text-ink transition-colors hover:bg-tint2",
        active && "bg-tint2 text-navy",
      )}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />;

export const RichEditor = forwardRef<RichEditorHandle, { initialMarkdown: string }>(function RichEditor({ initialMarkdown }, ref) {
  const fileRef = useRef<HTMLInputElement>(null);
  // preview URL (e.g. raw.githubusercontent.com) -> /images/blog path, for images uploaded in this session
  const previews = useRef(new Map<string, string>());
  const initialHtml = useMemo(() => (initialMarkdown ? (marked.parse(initialMarkdown, { async: false }) as string) : ""), [initialMarkdown]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "本文を入力してください..." }),
    ],
    content: initialHtml,
  });

  useImperativeHandle(ref, () => ({
    getMarkdown() {
      if (!editor) return initialMarkdown;
      let md = turndown.turndown(editor.getHTML());
      for (const [preview, path] of previews.current) md = md.split(preview).join(path);
      return md;
    },
  }));

  if (!editor) return <div className="min-h-[360px] rounded-lg border border-line bg-white" aria-busy="true" />;

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("リンクURLを入力してください", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(url)) {
      toast.error("リンクは http(s):// で始まるURLを入力してください。");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    const id = toast.loading("画像をアップロード中...");
    const res = await uploadImage(file);
    if (res.ok) {
      previews.current.set(res.data.previewUrl, res.data.path);
      editor.chain().focus().setImage({ src: res.data.previewUrl }).run();
      toast.success("画像を挿入しました。", { id });
    } else {
      toast.error(res.error, { id });
    }
  }

  const c = () => editor.chain().focus();
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white focus-within:border-mid focus-within:ring-3 focus-within:ring-mid/30">
      <div role="toolbar" aria-label="書式" className="flex flex-wrap items-center gap-0.5 border-b border-line bg-tint px-2 py-1.5">
        <ToolbarButton title="見出し2" active={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="見出し3" active={editor.isActive("heading", { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="size-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton title="太字" active={editor.isActive("bold")} onClick={() => c().toggleBold().run()}>
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="斜体" active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}>
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="取り消し線" active={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}>
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton title="箇条書き" active={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}>
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="番号付きリスト" active={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}>
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton title="引用" active={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}>
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="リンク" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="画像を挿入" onClick={() => fileRef.current?.click()}>
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton title="区切り線" onClick={() => c().setHorizontalRule().run()}>
          <Minus className="size-4" />
        </ToolbarButton>
        <Sep />
        <ToolbarButton title="元に戻す" onClick={() => c().undo().run()}>
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton title="やり直す" onClick={() => c().redo().run()}>
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="rich-content" />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onFile} hidden />
    </div>
  );
});
