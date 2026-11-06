import type { ReactNode } from "react";
import { Reveal } from "@/components/flow/Reveal";
import { cn } from "@/lib/utils";

/** Browser-window frame (`.bwin`): three dots + URL pill + body. Used by the Notion mock and the smart-mensetsu embed. */
export function BrowserFrame({
  url,
  children,
  big,
  bodyClassName,
}: {
  url: string;
  children: ReactNode;
  big?: boolean;
  bodyClassName?: string;
}) {
  return (
    <Reveal className={cn("bwin", big && "big")}>
      <div className="bwin-bar">
        <i />
        <i />
        <i />
        <span className="url">{url}</span>
      </div>
      <div className={cn("bwin-b", bodyClassName)}>{children}</div>
    </Reveal>
  );
}
