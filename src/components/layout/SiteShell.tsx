import type { ReactNode } from "react";
import { BlobDefs } from "@/components/flow/WaveMask";
import { FlowCurrent } from "@/components/flow/FlowCurrent";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Header + river + `<main>` + Footer. Page sections must be direct children of `children`. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <BlobDefs />
      <FlowCurrent />
      <Header />
      <div className="site" id="site">
        <main id="main">{children}</main>
        <Footer />
      </div>
    </>
  );
}
