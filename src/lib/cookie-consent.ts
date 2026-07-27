export const CONSENT_KEY = 'cookie-consent'
/** Previous key — migrated on read/write so old choices still apply once. */
export const LEGACY_CONSENT_KEY = 'thaiplot-cookie-consent'
export const CONSENT_EVENT = 'cookie-consent-changed'

export type ConsentValue = 'accepted' | 'rejected'

function normalizeConsent(raw: string | null): ConsentValue | null {
  if (raw === 'accepted') return 'accepted'
  // Legacy value was `declined`
  if (raw === 'rejected' || raw === 'declined') return 'rejected'
  return null
}

/** Read consent from localStorage. Returns null when missing or storage is blocked. */
export function readCookieConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const current = normalizeConsent(localStorage.getItem(CONSENT_KEY))
    if (current) return current

    const legacy = normalizeConsent(localStorage.getItem(LEGACY_CONSENT_KEY))
    if (legacy) {
      // Migrate quietly so both components stay in sync
      try {
        localStorage.setItem(CONSENT_KEY, legacy)
        localStorage.removeItem(LEGACY_CONSENT_KEY)
      } catch {
        // ignore migrate failures
      }
      return legacy
    }
    return null
  } catch {
    // Private/incognito or blocked storage → treat as no consent
    return null
  }
}

export function writeCookieConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(CONSENT_KEY, value)
    localStorage.removeItem(LEGACY_CONSENT_KEY)
  } catch {
    // Still notify listeners; UI can dismiss even if storage fails
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }
}

export function hasAcceptedCookieConsent(): boolean {
  return readCookieConsent() === 'accepted'
}
