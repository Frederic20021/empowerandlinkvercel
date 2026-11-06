import type { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin } from "@/lib/admin-auth";
import { validatePostInput } from "@/lib/blog-admin";
import { isValidSlug } from "@/lib/blog-slug";
import { deletePostAndImages, getBlogStore } from "@/lib/blog-store";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { slug } = await params;
  if (!isValidSlug(slug)) return jsonError("スラッグが正しくありません。", 400);
  try {
    const post = await getBlogStore().getPost(slug);
    return post ? jsonOk({ post }) : jsonError("記事が見つかりません。", 404);
  } catch (e) {
    console.error("[admin] get post failed", e);
    return jsonError("記事の読み込みに失敗しました。", 500);
  }
}

/**
 * Create or update. `slug` in the URL is the post being edited (or the new slug when `create` is true);
 * `slug` in the body is the wanted slug. When they differ the old file is removed after the new one is written.
 */
export async function PUT(request: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { slug: urlSlug } = await params;
  if (!isValidSlug(urlSlug)) return jsonError("スラッグが正しくありません。", 400);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("リクエストの形式が正しくありません。", 400);
  }
  const create = (raw as { create?: unknown } | null)?.create === true;
  const parsed = validatePostInput(raw);
  if (!parsed.ok) return jsonError(parsed.errors[0], 400, { errors: parsed.errors });
  const input = parsed.value;

  try {
    const store = getBlogStore();
    if (create || input.slug !== urlSlug) {
      if (await store.getPost(input.slug)) return jsonError("このスラッグの記事はすでに存在します。", 409);
    }
    if (!create && !(await store.getPost(urlSlug))) return jsonError("記事が見つかりません。", 404);
    await store.savePost(input);
    if (!create && input.slug !== urlSlug) await store.deletePost(urlSlug, input.title);
    return jsonOk({ slug: input.slug, driver: store.driver });
  } catch (e) {
    console.error("[admin] save post failed", e);
    return jsonError("保存に失敗しました。", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { slug } = await params;
  if (!isValidSlug(slug)) return jsonError("スラッグが正しくありません。", 400);
  try {
    const store = getBlogStore();
    const removed = await deletePostAndImages(store, slug);
    return removed ? jsonOk({ ok: true, driver: store.driver }) : jsonError("記事が見つかりません。", 404);
  } catch (e) {
    console.error("[admin] delete post failed", e);
    return jsonError("削除に失敗しました。", 500);
  }
}
