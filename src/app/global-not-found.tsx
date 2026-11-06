import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontClassName } from "@/lib/fonts";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "ページが見つかりません | エンパワー＆リンク株式会社",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ja" className={fontClassName} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SiteShell>
          <section className="sec" id="not-found">
            <div className="wrap narrow" style={{ textAlign: "center" }}>
              <p className="eyebrow center">
                <i />
                404
              </p>
              <h1>
                ページが<span className="hl">見つかりません</span>
              </h1>
              <p className="lead" style={{ marginInline: "auto" }}>
                お探しのページは移動または削除された可能性があります。トップページからもう一度お探しください。
              </p>
              <div className="cta-row center">
                <Link className="btn btn-primary" href="/">
                  <span>トップページへ</span>
                </Link>
                <Link className="btn btn-ghost" href="/contact">
                  <span>お問い合わせ</span>
                </Link>
              </div>
            </div>
          </section>
        </SiteShell>
      </body>
    </html>
  );
}
