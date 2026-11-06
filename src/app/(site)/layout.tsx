import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

/** Public marketing pages: header, flowing river, footer. The admin lives outside this group. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
