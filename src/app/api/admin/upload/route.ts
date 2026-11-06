import type { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin } from "@/lib/admin-auth";
import { MAX_UPLOAD_BYTES, buildUploadName, validateUpload } from "@/lib/blog-admin";
import { getBlogStore } from "@/lib/blog-store";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  // Cheap early refusal before the body is parsed (multipart overhead gets a small allowance).
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) return jsonError("画像は5MB以下にしてください。", 413);

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return jsonError("リクエストの形式が正しくありません。", 400);
  }
  if (!(file instanceof File)) return jsonError("ファイルが選択されていません。", 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = validateUpload({ declaredType: file.type, size: file.size, bytes });
  if (!check.ok) return jsonError(check.error, 400);

  try {
    const saved = await getBlogStore().saveImage(buildUploadName(file.name, check.ext), bytes);
    return jsonOk(saved, 201);
  } catch (e) {
    console.error("[admin] upload failed", e);
    return jsonError("画像のアップロードに失敗しました。", 500);
  }
}
