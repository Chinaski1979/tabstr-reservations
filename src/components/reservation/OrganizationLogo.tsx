import { useState } from "react"

import { cn } from "@/lib/utils"

interface OrganizationLogoProps {
  /** null when the organization never uploaded one. */
  src: string | null
  className?: string
}

/**
 * Decorative: every caller renders the organization name as text next to it, so
 * a missing or broken logo must leave no gap and no duplicate announcement.
 */
export function OrganizationLogo({ src, className }: OrganizationLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || src === failedSrc) return null

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      onError={() => setFailedSrc(src)}
      className={cn(
        "size-25 shrink-0 rounded-lg object-cover ring-1 ring-border",
        className
      )}
    />
  )
}
