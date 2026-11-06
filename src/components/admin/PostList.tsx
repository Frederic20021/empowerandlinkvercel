"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminHeader } from "./AdminHeader";
import { adminApi, type PostSummary } from "./api";

export function PostList() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await adminApi<{ posts: PostSummary[] }>("/api/admin/posts");
    if (res.ok) setPosts(res.data.posts);
    else {
      setPosts([]);
      toast.error(res.error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
    void load();
  }, [load]);

  async function remove(slug: string) {
    setBusy(true);
    const res = await adminApi(`/api/admin/posts/${encodeURIComponent(slug)}`, { method: "DELETE" });
    setBusy(false);
    setConfirming(null);
    if (res.ok) {
      toast.success("削除しました。");
      void load();
    } else {
      toast.error(res.error || "削除に失敗しました。");
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <AdminHeader title="ブログ管理">
        <Link href="/admin/posts/new" className={buttonVariants({})}>
          <Plus aria-hidden="true" />
          新規記事作成
        </Link>
      </AdminHeader>

      {posts === null ? (
        <p className="py-10 text-center text-muted">読み込み中...</p>
      ) : posts.length === 0 ? (
        <p className="rounded-xl border border-line bg-white py-10 text-center text-muted">
          まだ記事がありません。「新規記事作成」から作成してください。
        </p>
      ) : (
        <ul className="grid gap-3">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1 basis-64">
                  <p className="font-bold break-words text-ink">{p.title || "(無題)"}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <time dateTime={p.date}>{p.date}</time>
                    <span className="break-all">{p.slug}</span>
                    <span
                      className={
                        p.published
                          ? "rounded-full bg-tint2 px-2 py-0.5 font-bold text-navy"
                          : "rounded-full bg-line px-2 py-0.5 font-bold text-muted"
                      }
                    >
                      {p.published ? "公開" : "下書き"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/posts/${p.slug}`} className={buttonVariants({ variant: "secondary" })}>
                    編集
                  </Link>
                  <Button variant="outline" className="text-red" onClick={() => setConfirming(p.slug)} disabled={busy}>
                    削除
                  </Button>
                </div>
              </div>
              {confirming === p.slug ? (
                <div role="alertdialog" aria-label="削除の確認" className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-red/10 p-3 text-sm">
                  <p className="mr-auto text-ink">この記事を削除しますか？ この記事だけで使われている画像も削除されます。</p>
                  <Button variant="outline" onClick={() => setConfirming(null)} disabled={busy}>
                    キャンセル
                  </Button>
                  <Button variant="destructive" onClick={() => remove(p.slug)} disabled={busy}>
                    {busy ? "削除中..." : "削除する"}
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
