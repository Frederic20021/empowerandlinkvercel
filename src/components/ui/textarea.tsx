import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-lg border border-line bg-white px-3 py-2 text-base text-ink transition-colors outline-none placeholder:text-muted/70 focus-visible:border-mid focus-visible:ring-3 focus-visible:ring-mid/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red aria-invalid:ring-3 aria-invalid:ring-red/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
