import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ブログ管理",
  robots: { index: false, follow: false, nocache: true },
};

/** The admin sits outside the (site) group, so it has no marketing header, footer or river. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root min-h-screen bg-tint font-sans text-ink">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}
