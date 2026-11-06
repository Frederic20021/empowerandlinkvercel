"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOBILE_NAV, NAV, SITE } from "@/content/site";
import { isActiveHref } from "./nav";

const TOAST_TEXT = "英語版は準備中です";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = () => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2400);
  };

  return (
    <>
      <header className="site-header" id="top">
        <div className="hwrap">
          <Link className="brand" href="/" aria-label={SITE.name}>
            <Image src={SITE.logo} alt={SITE.logoAlt} width={512} height={600} priority />
          </Link>
          <nav className="nav" aria-label="メイン">
            {NAV.map((n) => {
              const active = isActiveHref(n.href, pathname);
              const cta = Boolean(n.style);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(cta ? "nav-cta btn btn-primary" : "nav-link", active && "is-active")}
                  aria-current={active && !n.href.includes("#") ? "page" : undefined}
                >
                  {cta ? <span>{n.label}</span> : n.label}
                </Link>
              );
            })}
          </nav>
          <div className="lang" role="group" aria-label="Language">
            <button type="button" className="on" aria-pressed="true">
              JA
            </button>
            <button type="button" aria-pressed="false" onClick={showToast}>
              EN
            </button>
          </div>
          <button
            className="burger"
            type="button"
            aria-label="メニュー"
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="ic" strokeWidth={1.6} /> : <Menu className="ic" strokeWidth={1.6} />}
          </button>
        </div>
        <nav className={cn("mnav", open && "open")} id="mnav" aria-label="モバイル">
          {MOBILE_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={n.label === "お問い合わせ" ? "mcta" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
              <ArrowRight className="ic" strokeWidth={1.6} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </header>
      <div className={cn("toast", toast && "show")} role="status" aria-live="polite">
        {toast ? TOAST_TEXT : ""}
      </div>
    </>
  );
}
