import { SERVICE_PATHS } from "@/content/site";

/** Whether a header/footer link is the current page (home-page anchors count for service pages). */
export function isActiveHref(href: string, pathname: string): boolean {
  const path = href.split("#")[0] || "/";
  if (href.endsWith("#services")) return (SERVICE_PATHS as readonly string[]).includes(pathname);
  if (href.includes("#")) return false;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}
