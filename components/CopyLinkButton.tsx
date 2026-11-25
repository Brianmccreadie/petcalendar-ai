'use client'

import { useState } from 'react'

/** Copies this page's own address (or shares it natively on phones). */
export default function CopyLinkButton({ title, className = 'btn btn-dark btn-sm' }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Cancelled, or the clipboard is blocked: the address bar still has the link.
    }
  }

  return (
    <button type="button" className={className} onClick={share}>
      {copied ? 'Link copied' : 'Copy link to share'}
    </button>
  )
}
