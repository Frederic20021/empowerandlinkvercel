import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-line bg-white px-3 py-1 text-base text-ink transition-colors outline-none placeholder:text-muted/70 focus-visible:border-mid focus-visible:ring-3 focus-visible:ring-mid/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red aria-invalid:ring-3 aria-invalid:ring-red/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
