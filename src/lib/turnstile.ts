/**
 * Server-side Cloudflare Turnstile verification.
 * Same pattern as hua-hin-land.com.
 */
export async function verifyTurnstileToken(
  token: unknown,
  remoteip?: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!token || typeof token !== 'string') {
    return { ok: false, error: 'Security check failed' }
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not set')
    return { ok: false, error: 'Security check failed' }
  }

  try {
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          response: token,
          ...(remoteip ? { remoteip } : {}),
        }),
        cache: 'no-store',
      }
    )
    const turnstileData = await turnstileResponse.json()
    if (!turnstileData.success) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Turnstile verification failed', {
          codes: turnstileData['error-codes'],
          hostname: turnstileData.hostname,
        })
      }
      return { ok: false, error: 'Security check failed' }
    }
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'Security check failed' }
  }
}

export function requestClientIp(req: Request): string | undefined {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined
  )
}
