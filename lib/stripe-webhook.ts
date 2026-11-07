import type Stripe from 'stripe'

export type WebhookEndpoint = 'academy' | 'social'

/**
 * Each Stripe webhook endpoint has its own signing secret:
 *   /api/stripe/webhook               → STRIPE_WEBHOOK_SECRET_ACADEMY
 *   /api/social-media/stripe-webhook  → STRIPE_WEBHOOK_SECRET_SOCIAL
 *
 * The old shared STRIPE_WEBHOOK_SECRET is still tried as a transition
 * fallback so whichever endpoint works today keeps working until the new
 * variables are set. Remove STRIPE_WEBHOOK_SECRET once both are in place.
 */
export function getWebhookSecrets(endpoint: WebhookEndpoint): string[] {
  const specific = endpoint === 'academy'
    ? process.env.STRIPE_WEBHOOK_SECRET_ACADEMY
    : process.env.STRIPE_WEBHOOK_SECRET_SOCIAL
  const legacy = process.env.STRIPE_WEBHOOK_SECRET
  return [specific, legacy].filter((s): s is string => Boolean(s))
}

/** Returns the verified event, or null if no configured secret matches. */
export function verifyStripeEvent(
  stripe: Stripe,
  payload: string,
  signature: string,
  endpoint: WebhookEndpoint
): Stripe.Event | null {
  for (const secret of getWebhookSecrets(endpoint)) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret)
    } catch {
      // try the next configured secret
    }
  }
  return null
}
