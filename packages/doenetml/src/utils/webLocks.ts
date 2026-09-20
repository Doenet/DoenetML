/**
 * Feature detection for the Web Locks API, shared by the boot-path mechanisms
 * built on it.
 *
 * Web Locks are scoped to an ORIGIN and span every same-origin realm the
 * browser is running — the activity iframes on a page, and other tabs on the
 * same site. That scope is what makes a lock usable as coordination between
 * realms that know nothing about each other, with nothing for a host page to
 * install; every consumer here relies on it.
 *
 * Both consumers must also survive its absence: a browser without Web Locks,
 * or an embedding that throws on `navigator` access, has to degrade to the
 * behavior that predates them rather than fail a boot over bookkeeping.
 */

export type LockManagerLike = {
    request: (
        name: string,
        options: {
            mode?: "exclusive" | "shared";
            ifAvailable?: boolean;
            signal?: AbortSignal;
        },
        callback: (lock: unknown) => Promise<void>,
    ) => Promise<void>;
    // Only `held` is read: the locks queried through here are shared ones,
    // granted on request, so a realm counting them never appears in `pending`.
    query?: () => Promise<{ held?: { name?: string }[] }>;
};

/** The realm's lock manager, or null wherever one cannot be reached. */
export function lockManager(): LockManagerLike | null {
    try {
        const locks = (navigator as any)?.locks;
        return locks && typeof locks.request === "function" ? locks : null;
    } catch {
        // Some embeddings throw on `navigator` access rather than returning
        // undefined; treat that as "no Web Locks" like any other absence.
        return null;
    }
}
