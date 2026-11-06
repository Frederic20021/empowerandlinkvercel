export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

/** JSON fetch for the admin APIs. A 401 sends the browser back to the login page. */
export async function adminApi<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { credentials: "same-origin", ...init });
    if (res.status === 401 && !url.endsWith("/login")) {
      // Full navigation on purpose: drops any stale client state along with the expired session.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin/login";
    }
    const body = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok) return { ok: false, status: res.status, error: body.error || "エラーが発生しました。" };
    return { ok: true, data: body };
  } catch {
    return { ok: false, status: 0, error: "通信に失敗しました。ネットワークをご確認ください。" };
  }
}

export type PostSummary = { slug: string; title: string; date: string; excerpt: string; published: boolean };
export type PostFull = PostSummary & { coverImage: string; content: string };
export type UploadResult = { path: string; previewUrl: string };

export async function uploadImage(file: File): Promise<ApiResult<UploadResult>> {
  const fd = new FormData();
  fd.append("file", file);
  return adminApi<UploadResult>("/api/admin/upload", { method: "POST", body: fd });
}
