/**
 * The page-wide handshake census (#1711): how many core-worker handshakes are
 * running at once, and on how many cores.
 *
 * The watchdog that guards a handshake was sized on developer hardware, where
 * the handshake "stays bounded under CPU pressure". On the 1.1 GHz dual-core
 * machine in #1707 it is not bounded: a page of activities all booting at once
 * pushes a perfectly healthy handshake past the budget, and the watchdog then
 * makes the document unloadable on exactly the contended machines it exists to
 * protect. Sizing the budget to the pressure a handshake actually faces needs
 * a number no realm can see on its own — hence a census.
 *
 * A `shared` Web Lock is the whole mechanism: every realm mid-handshake holds
 * the same lock name, shared mode grants them all immediately, and
 * `navigator.locks.query()` reports the holders. It gates nothing. The browser
 * drops a lock when its realm goes away, so a crashed activity cannot inflate
 * the count forever.
 *
 * The census is deliberately independent of any boot gate, and uses a lock
 * name of its own: a page whose host schedules boots itself takes no gate
 * locks at all, and those pages (assignment-viewer, the docs site) are exactly
 * where cores share a worker thread and contention matters most.
 *
 * Everything here is best-effort. A census that cannot be joined or queried
 * reads as "no visible contention", which is the behavior that predates it.
 */

import { lockManager } from "./webLocks";

/**
 * Lock name held — in `shared` mode, so every holder is granted at once — for
 * the duration of a core handshake.
 */
const HANDSHAKE_CENSUS_LOCK = "doenet-handshake-census";

/**
 * How long to wait for the (shared, therefore immediately grantable) census
 * lock before giving up and proceeding uncounted. Joining the census is
 * bookkeeping; nothing should ever wait on it.
 */
const CENSUS_JOIN_TIMEOUT_MS = 1_000;

/**
 * The handle a handshake holds when it could not take a seat: releasing it
 * frees nothing, because nothing was taken. Shared, since it carries no state.
 */
const NO_CENSUS_SEAT = { release: () => {} };

/**
 * How many logical cores the browser admits to, or 0 where the hint is
 * unavailable (no `navigator`, or a browser that withholds it). Callers decide
 * what to assume in that case, and they differ — `DocViewer` substitutes 1 —
 * so no default is baked in here.
 *
 * Lives beside the census because it is the other half of the ratio the census
 * exists to produce: handshakes in flight, per core able to work on them.
 */
export function reportedCores(): number {
    try {
        return typeof navigator !== "undefined" && navigator.hardwareConcurrency
            ? navigator.hardwareConcurrency
            : 0;
    } catch {
        // Same defensiveness as `lockManager`: an embedding that throws on
        // `navigator` access must read as "no hint", not take down the boot it
        // is only being consulted to size.
        return 0;
    }
}

/**
 * Join the page-wide count of in-flight core handshakes for as long as the
 * returned handle is unreleased.
 *
 * Held in `shared` mode, so joining never blocks and never gates: this is
 * bookkeeping, not admission control. Callers must release it when the
 * handshake concludes; if they do not, the browser still drops it when the
 * realm goes away, so a crashed realm cannot inflate the count forever.
 *
 * Resolves to a no-op handle wherever Web Locks are unavailable — the count
 * then reads as "no visible contention", which is the pre-#1711 behavior.
 */
export function joinHandshakeCensus(): Promise<{ release: () => void }> {
    const locks = lockManager();
    if (!locks) {
        return Promise.resolve(NO_CENSUS_SEAT);
    }
    return new Promise((resolve) => {
        let released = false;
        let giveUp: ReturnType<typeof setTimeout> | null = null;
        let settled = false;
        function settle(handle: { release: () => void }) {
            if (settled) {
                return;
            }
            settled = true;
            if (giveUp !== null) {
                clearTimeout(giveUp);
                giveUp = null;
            }
            resolve(handle);
        }
        try {
            locks
                .request(HANDSHAKE_CENSUS_LOCK, { mode: "shared" }, () => {
                    if (released) {
                        return Promise.resolve();
                    }
                    return new Promise<void>((release) => {
                        settle({
                            release: () => {
                                released = true;
                                release();
                            },
                        });
                    });
                })
                .catch(() => {
                    // Counting is best-effort: a census we cannot join just
                    // means this realm's handshake is invisible to its
                    // siblings, which degrades the watchdog to its fixed
                    // base.
                    settle(NO_CENSUS_SEAT);
                });
        } catch {
            // A lock manager can also fail synchronously (a restricted
            // embedding's SecurityError, say), and a throw inside this
            // promise's executor would reject the join. The join never
            // rejects — its callers attach handlers late, and a census that
            // cannot be joined reads as "no visible contention" — so a
            // synchronous failure settles the same way an asynchronous one
            // does.
            settle(NO_CENSUS_SEAT);
        }
        if (!settled) {
            // Shared locks are granted immediately in practice; this guards
            // the pathological case rather than any expected one. Marking it
            // released first matters: without that, a grant arriving after
            // this fired would be held by a handle nobody has, permanently
            // inflating the count every later handshake sizes its watchdog
            // against.
            giveUp = setTimeout(() => {
                released = true;
                settle(NO_CENSUS_SEAT);
            }, CENSUS_JOIN_TIMEOUT_MS);
        }
    });
}

/**
 * How many core handshakes are in flight across every same-origin realm the
 * browser is running (see the origin-scope note in `webLocks`), including this
 * one.
 *
 * Returns 1 ("just me") whenever the true figure cannot be obtained, so
 * callers scale from a neutral baseline rather than from zero. Asking costs an
 * await, so the boot path reads the cache below instead of calling this.
 */
export async function countConcurrentHandshakes(): Promise<number> {
    const locks = lockManager();
    if (!locks?.query) {
        return 1;
    }
    try {
        const state = await locks.query();
        const held = (state.held ?? []).filter(
            (lock) => lock.name === HANDSHAKE_CENSUS_LOCK,
        ).length;
        return Math.max(1, held);
    } catch {
        return 1;
    }
}

/**
 * Last observed number of in-flight handshakes, refreshed in the background by
 * `refreshHandshakeCensusCount`. Starts at the neutral "just me".
 */
let lastKnownConcurrentHandshakes = 1;

/**
 * How many handshakes were in flight the last time anyone looked — read
 * synchronously, so consulting it never adds an await to a boot.
 *
 * That property is load-bearing, not an optimization. This count only sizes a
 * watchdog; nothing about starting a document depends on it. Awaiting Web
 * Locks for it put extra suspension points into `startCore`, which widened the
 * window in which a catalog-driven rebuild could overlap the ladder already
 * running. Two ladders then tore down each other's worker through the shared
 * `coreWorker` ref, and the document ended up with no diagnostics published
 * at all — a `DocViewer/i18n` CI failure bisected to exactly that change. A
 * count one boot out of date is a perfectly good input to a timeout; a boot
 * that races itself is not.
 */
export function concurrentHandshakesSnapshot(): number {
    return lastKnownConcurrentHandshakes;
}

/**
 * Update the cached count, off the caller's critical path. Deliberately
 * returns nothing to await: a caller that waited on it would reintroduce the
 * suspension point `concurrentHandshakesSnapshot` exists to avoid.
 *
 * Because the update lands a turn or more later, the reading a caller gets
 * from `concurrentHandshakesSnapshot` is always the one *before* its own
 * refresh. A boot refreshes once per handshake attempt and nowhere earlier,
 * so each read is answered by the previous attempt's refresh, and a first
 * attempt reads the count one refresh behind.
 */
export function refreshHandshakeCensusCount(): void {
    countConcurrentHandshakes()
        .then((count) => {
            lastKnownConcurrentHandshakes = count;
        })
        .catch(() => {
            // `countConcurrentHandshakes` swallows its own failures and falls
            // back to the neutral 1, so there is nothing to handle here; the
            // handler only satisfies "no fire-and-forget promises".
        });
}
