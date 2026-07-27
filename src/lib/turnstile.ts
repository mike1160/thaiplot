/**
 * Server-side Cloudflare Turnstile verification.
 * Same pattern as hua-hin-land.com.
 */
export async function verifyTurnstileToken(
  token: unknown
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
        }),
      }
    )
    const turnstileData = await turnstileResponse.json()
    if (!turnstileData.success) {
      return { ok: false, error: 'Security check failed' }
    }
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'Security check failed' }
  }
}
