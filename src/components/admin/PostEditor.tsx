"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isValidSlug } from "@/lib/blog-slug";
import { slugify } from "@/lib/utils";
import { AdminHeader } from "./AdminHeader";
import { adminApi, uploadImage, type PostFull } from "./api";
import { RichEditor, type RichEditorHandle } from "./RichEditor";

type Form = { title: string; slug: string; date: string; excerpt: string; coverImage: string; published: boolean };

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = (): Form => ({ title: "", slug: "", date: today(), excerpt: "", coverImage: "", published: true });

/** Slug suggestion: ASCII words from the title, else a dated fallback (Japanese titles have no ASCII words). */
function suggestSlug(title: string, date: string): string {
  return slugify(title).slice(0, 80).replace(/-+$/, "") || `post-${date.replace(/-/g, "")}`;
}

function Field({ id, label, required, hint, children }: { id: string; label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-red">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function PostEditor({ slug }: { slug?: string }) {
  const router = useRouter();
  const isEdit = Boolean(slug);
  const editorRef = useRef<RichEditorHandle>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(!isEdit);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [coverPreview, setCoverPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const res = await adminApi<{ post: PostFull }>(`/api/admin/posts/${encodeURIComponent(slug)}`);
      if (cancelled) return;
      if (!res.ok) {
        toast.error(res.error);
        router.replace("/admin");
        return;
      }
      const p = res.data.post;
      setForm({ title: p.title, slug: p.slug, date: p.date || today(), excerpt: p.excerpt, coverImage: p.coverImage, published: p.published });
      setContent(p.content);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function onTitle(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : suggestSlug(title, f.date) }));
  }

  async function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const res = await uploadImage(file);
    setUploading(false);
    if (res.ok) {
      set("coverImage", res.data.path);
      setCoverPreview(res.data.previewUrl);
      toast.success("画像をアップロードしました。記事を保存すると反映されます。");
    } else {
      toast.error(res.error);
    }
  }

  async function save() {
    if (!form.title.trim()) return void toast.error("タイトルを入力してください。");
    if (!isValidSlug(form.slug)) return void toast.error("スラッグは半角の小文字英数字とハイフンのみで入力してください。");
    if (!form.date) return void toast.error("公開日を入力してください。");
    setSaving(true);
    const res = await adminApi<{ driver: string }>(`/api/admin/posts/${encodeURIComponent(isEdit ? slug! : form.slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, content: editorRef.current?.getMarkdown() ?? content, create: !isEdit }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success(res.data.driver === "github" ? "保存しました。反映まで約1～2分かかります。" : "保存しました。");
      router.push("/admin");
    } else {
      toast.error(res.error || "保存に失敗しました。");
    }
  }

  async function remove() {
    if (!slug) return;
    setDeleting(true);
    const res = await adminApi(`/api/admin/posts/${encodeURIComponent(slug)}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      toast.success("削除しました。");
      router.push("/admin");
    } else {
      toast.error(res.error || "削除に失敗しました。");
    }
  }

  const coverSrc = coverPreview || form.coverImage;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <AdminHeader title={isEdit ? "記事を編集" : "新規記事作成"}>
        <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
          戻る
        </Link>
      </AdminHeader>

      {!loaded ? (
        <p className="py-10 text-center text-muted">読み込み中...</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
          className="grid gap-5 rounded-2xl border border-line bg-white p-5 sm:p-7"
          noValidate
        >
          <Field id="post-title" label="タイトル" required>
            <Input id="post-title" value={form.title} onChange={(e) => onTitle(e.target.value)} />
          </Field>

          <Field id="post-slug" label="スラッグ（URL識別子）" required hint="半角の小文字英数字とハイフン。公開URLは /blog/スラッグ になります。">
            <Input
              id="post-slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              placeholder="例: blog-test"
              autoCapitalize="none"
              spellCheck={false}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="post-date" label="公開日" required>
              <Input id="post-date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <div className="grid content-start gap-2">
              <span className="text-sm leading-none font-medium">公開設定</span>
              <label className="flex h-10 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set("published", e.target.checked)}
                  className="size-4 accent-[var(--navy)]"
                />
                公開する（オフにすると下書き）
              </label>
            </div>
          </div>

          <Field id="post-excerpt" label="抜粋（一覧に表示される概要）">
            <Textarea id="post-excerpt" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} />
          </Field>

          <Field id="post-cover" label="カバー画像">
            <div className="flex flex-wrap gap-2">
              <Input
                id="post-cover"
                value={form.coverImage}
                onChange={(e) => {
                  set("coverImage", e.target.value);
                  setCoverPreview("");
                }}
                placeholder="/images/blog/..."
                className="min-w-0 flex-1 basis-56"
              />
              <Button type="button" variant="secondary" size="lg" onClick={() => coverInput.current?.click()} disabled={uploading}>
                {uploading ? "アップロード中..." : "画像をアップロード"}
              </Button>
              <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onCover} hidden />
            </div>
            {coverSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary just-uploaded file
              <img src={coverSrc} alt="カバー画像のプレビュー" className="mt-1 max-h-56 w-auto max-w-full rounded-lg border border-line object-contain" />
            ) : null}
          </Field>

          <div className="grid gap-2">
            <span className="text-sm leading-none font-medium">本文</span>
            <RichEditor ref={editorRef} initialMarkdown={content} />
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
            {isEdit ? (
              <Button type="button" variant="outline" className="text-red" onClick={() => setConfirmDelete(true)} disabled={saving || deleting}>
                削除
              </Button>
            ) : null}
            <div className="ml-auto flex gap-3">
              <Link href="/admin" className={buttonVariants({ variant: "outline", size: "lg" })}>
                キャンセル
              </Link>
              <Button type="submit" size="lg" disabled={saving || deleting}>
                {saving ? "保存中..." : "保存する"}
              </Button>
            </div>
          </div>

          {confirmDelete ? (
            <div role="alertdialog" aria-label="削除の確認" className="flex flex-wrap items-center gap-3 rounded-lg bg-red/10 p-3 text-sm">
              <p className="mr-auto text-ink">この記事を削除しますか？ この記事だけで使われている画像も削除されます。</p>
              <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                キャンセル
              </Button>
              <Button type="button" variant="destructive" onClick={remove} disabled={deleting}>
                {deleting ? "削除中..." : "削除する"}
              </Button>
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}
