import Image from "next/image";
import Link from "next/link";
import { FOOTER, SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="fwave" aria-hidden="true" />
      <div className="wrap fgrid">
        <div className="fbrand">
          <Link className="flogo" href="/">
            <Image src={SITE.logo} alt={SITE.logoAlt} width={512} height={600} />
          </Link>
          <p className="fname">
            {FOOTER.logo_texts[0]}
            <br />
            <b>{FOOTER.logo_texts[1]}</b>
          </p>
          <p className="ftag">{FOOTER.tagline[0]}</p>
          <p className="ftag">{FOOTER.tagline[1]}</p>
        </div>
        {FOOTER.columns.map((c) => (
          <div className="fcol" key={c.heading}>
            <h3>{c.heading}</h3>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="copy wrap">{FOOTER.copyright}</p>
    </footer>
  );
}
