/**
 * Escaping helpers for untrusted input.
 */

/**
 * Returns a safely quoted Airtable formula string literal, e.g.
 *   `LOWER({Email}) = ${airtableString(email)}`
 * Backslashes and double quotes are escaped; control characters are removed.
 */
export function airtableString(value: unknown): string {
  const cleaned = String(value ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
  return `"${cleaned}"`
}

/** Escapes text for safe inclusion in HTML (email bodies, etc.). */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
