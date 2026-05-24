// Jednoduchý in-memory token bucket per kľúč.

type Bucket = { tokens: number; lastRefill: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
    key: string,
    capacity: number,
    refillPerMinute: number
): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const refillPerMs = refillPerMinute / 60_000;

    let b = buckets.get(key);
    if (!b) {
        b = { tokens: capacity, lastRefill: now };
        buckets.set(key, b);
    } else {
        const elapsed = now - b.lastRefill;
        b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerMs);
        b.lastRefill = now;
    }

    if (b.tokens >= 1) {
        b.tokens -= 1;
        return { allowed: true, remaining: Math.floor(b.tokens) };
    }
    return { allowed: false, remaining: 0 };
}

export function bucketKey(cookieValue: string | undefined, action: string): string {
    return `${action}:${cookieValue || "anon"}`;
}
