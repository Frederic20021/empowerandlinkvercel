"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { adminApi } from "./api";

export function AdminHeader({ title, children }: { title: string; children?: ReactNode }) {
  const router = useRouter();
  async function logout() {
    await adminApi("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <header className="mb-6 flex flex-wrap items-center gap-3">
      <h1 className="mr-auto font-sans text-xl font-bold text-navy sm:text-2xl">{title}</h1>
      {children}
      <Link href="/" className={buttonVariants({ variant: "ghost" })}>
        ホームページへ戻る
      </Link>
      <Button variant="outline" onClick={logout}>
        <LogOut aria-hidden="true" />
        ログアウト
      </Button>
    </header>
  );
}
