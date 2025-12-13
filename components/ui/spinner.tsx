import type React from "react"
import { Loader2Icon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

function Spinner({ className, size, ...props }: React.ComponentProps<"svg"> & VariantProps<typeof spinnerVariants>) {
  return (
    <Loader2Icon role="status" aria-label="Loading" className={cn(spinnerVariants({ size }), className)} {...props} />
  )
}

export { Spinner }
