import { toBlob } from "html-to-image"

const PIXEL_RATIO = 2
const PAGE_BACKGROUND = "#191b1c"
const CARD_BACKGROUND = "#202324"
const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const REVOKE_URL_MS = 1000

export async function downloadReservationImage(
  node: HTMLElement,
  filename: string
): Promise<void> {
  const blob = await captureVoucherBlob(node)
  const safeName = sanitizeFilename(filename)
  const file = new File([blob], safeName, { type: "image/png" })

  if (shouldShareOnIos(file)) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch (error) {
      if (isAbortError(error)) return
    }
  }

  triggerDownload(blob, safeName)
}

async function captureVoucherBlob(node: HTMLElement): Promise<Blob> {
  const width = Math.ceil(node.getBoundingClientRect().width)
  const height = Math.ceil(node.getBoundingClientRect().height)
  const options = {
    cacheBust: true,
    pixelRatio: PIXEL_RATIO,
    width,
    height,
    backgroundColor: PAGE_BACKGROUND,
    imagePlaceholder: TRANSPARENT_PNG,
    onImageErrorHandler: () => undefined,
    // html-to-image copies computed auto-margins onto a canvas the size of the
    // box, which shifts the clone and clips the right edge. Pin the clone.
    style: {
      margin: "0",
      inset: "auto",
      transform: "none",
      backgroundColor: CARD_BACKGROUND,
    },
  }

  try {
    const blob = await toBlob(node, options)
    if (blob) return blob
  } catch {
    // Remote logos without CORS abort the first pass; retry without images.
  }

  const blob = await toBlob(node, {
    ...options,
    filter: (element) => element.tagName !== "IMG",
  })
  if (!blob) {
    throw new Error("Reservation image capture returned no data")
  }
  return blob
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_URL_MS)
}

function sanitizeFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop()?.trim() || "reservation.png"
  return base.replace(/[^\w.-]+/g, "-")
}

function shouldShareOnIos(file: File): boolean {
  if (!isIosUserAgent()) return false
  if (typeof navigator.canShare !== "function") return false
  try {
    return navigator.canShare({ files: [file] })
  } catch {
    return false
  }
}

function isIosUserAgent(): boolean {
  const ua = navigator.userAgent
  if (/iP(hone|ad|od)/i.test(ua)) return true
  return /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}
