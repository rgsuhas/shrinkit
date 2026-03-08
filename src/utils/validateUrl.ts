export function validateUrl(rawUrl: string): { valid: true } | { valid: false; error: string } {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
  if (!["http:", "https:"].includes(parsed.protocol))
    return { valid: false, error: "Only http and https URLs are allowed" };
  const h = parsed.hostname;
  if (h === "localhost" || h === "127.0.0.1" || h === "::1")
    return { valid: false, error: "Private URLs are not allowed" };
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h))
    return { valid: false, error: "Private IP ranges are not allowed" };
  return { valid: true };
}
