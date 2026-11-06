import type { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin } from "@/lib/admin-auth";
import { getBlogStore } from "@/lib/blog-store";

/** All posts including drafts (without bodies). */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const posts = await getBlogStore().listPosts();
    return jsonOk({
      posts: posts.map(({ slug, title, date, excerpt, published }) => ({ slug, title, date, excerpt, published })),
    });
  } catch (e) {
    console.error("[admin] list posts failed", e);
    return jsonError("記事の読み込みに失敗しました。", 500);
  }
}
