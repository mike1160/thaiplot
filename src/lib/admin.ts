/**
 * Compare admin secrets safely when the value contains `%`
 * (browsers / query parsing often mangle an unencoded trailing %).
 */
export function adminSecretsMatch(
  provided: string | null | undefined,
  expected: string | null | undefined
): boolean {
  if (!expected || !provided) return false

  const candidates = new Set<string>([provided])

  try {
    candidates.add(decodeURIComponent(provided))
  } catch {
    // ignore malformed sequences
  }

  // Treat a lone/broken % as literal percent
  candidates.add(provided.replace(/%(?![0-9A-Fa-f]{2})/g, '%25'))
  try {
    candidates.add(
      decodeURIComponent(provided.replace(/%(?![0-9A-Fa-f]{2})/g, '%25'))
    )
  } catch {
    // ignore
  }

  return candidates.has(expected)
}

export function adminListingsUrl(secret: string): string {
  return `/admin/listings?secret=${encodeURIComponent(secret)}`
}
