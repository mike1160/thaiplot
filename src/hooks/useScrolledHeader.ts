'use client'

import { useEffect, useState } from 'react'

const SCROLL_THRESHOLD = 60

/**
 * Tracks whether the page has scrolled past the hero threshold.
 * Header stays always visible — only visual style changes.
 */
export function useScrolledHeader(threshold = SCROLL_THRESHOLD): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY >= threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
