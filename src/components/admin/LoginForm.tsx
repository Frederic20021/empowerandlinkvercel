"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "./api";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("パスワードを入力してください。");
      return;
    }
    setBusy(true);
    const res = await adminApi("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
      return;
    }
    setBusy(false);
    setError(res.error);
  }

  return (
    <main className="grid min-h-full place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-7 shadow-card" noValidate>
        <div className="mb-5 grid size-12 place-items-center rounded-full bg-tint2 text-navy">
          <Lock className="size-5" aria-hidden="true" />
        </div>
        <h1 className="font-sans text-xl font-bold text-navy">管理画面</h1>
        <p className="mt-1 mb-5 text-sm text-muted">パスワードを入力してください。</p>
        <div className="grid gap-2">
          <Label htmlFor="admin-password">パスワード</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            aria-invalid={error ? true : undefined}
          />
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-red">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy}>
          {busy ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
    </main>
  );
}
