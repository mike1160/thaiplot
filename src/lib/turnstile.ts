/**
 * Server-side Cloudflare Turnstile verification.
 * Same pattern as hua-hin-land.com.
 */
export async function verifyTurnstileToken(
  token: unknown,
  remoteip?: string | null
): Promise<{ ok: true } | { ok: false; error: string; codes?: string[] }> {
  if (!token || typeof token !== 'string') {
    return { ok: false, error: 'Security check failed', codes: ['missing-input-response'] }
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY is not set')
    return { ok: false, error: 'Security check failed', codes: ['missing-input-secret'] }
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
    const turnstileData = (await turnstileResponse.json()) as {
      success?: boolean
      'error-codes'?: string[]
      hostname?: string
    }
    if (!turnstileData.success) {
      const codes = turnstileData['error-codes'] || []
      console.error('[turnstile] verification failed', {
        codes,
        hostname: turnstileData.hostname,
        hasRemoteIp: Boolean(remoteip),
      })
      return { ok: false, error: 'Security check failed', codes }
    }
    return { ok: true }
  } catch (error) {
    console.error('[turnstile] siteverify request error', error)
    return { ok: false, error: 'Security check failed', codes: ['internal-error'] }
  }
}

export function requestClientIp(req: Request): string | undefined {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined
  )
}
