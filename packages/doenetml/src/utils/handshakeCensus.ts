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
 *
 * Exported so tests can drive the census the way other realms do: seats taken
 * through the lock manager directly are visible to a query but leave this
 * realm's cached count untouched, which is the state a first boot is really
 * in (#1718).
 */
export const HANDSHAKE_CENSUS_LOCK = "doenet-handshake-census";

/**
 * How long to wait for the (shared, therefore immediately grantable) census
 * lock before giving up and proceeding uncounted. Joining the census is
 * bookkeeping; nothing should ever wait on it.
 */
const CENSUS_JOIN_TIMEOUT_MS = 1_000;

/**
 * A realm's place in the census, for as long as it holds the handle.
 */
export type HandshakeCensusSeat = {
    /** Leave the census. */
    release: () => void;
    /**
     * How many handshakes were in flight — this one included — when the seat
     * was granted, or the neutral 1 wherever the census could not be joined
     * or queried.
     *
     * Counted from inside the grant, which is what makes it usable on a first
     * boot: `concurrentHandshakesSnapshot` answers with the reading before
     * the caller's own refresh, and a realm's first handshake has no reading
     * before it (#1718).
     *
     * A promise, because the count is deliberately NOT what the seat waits
     * for: the handle resolves the moment the lock is granted, and the figure
     * follows a query later. A caller that has already started its handshake
     * consumes it where it lands.
     */
    count: Promise<number>;
};

/**
 * The handle a handshake holds when it could not take a seat: releasing it
 * frees nothing, because nothing was taken, and it reports the neutral "just
 * me" count. Shared, since it carries no state.
 */
const NO_CENSUS_SEAT: HandshakeCensusSeat = {
    release: () => {},
    count: Promise.resolve(1),
};

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
 * The seat reports the count it observed as it was granted, which is the only
 * census reading a first handshake can have (#1718): the cached snapshot
 * answers with the reading before the caller's own refresh, and a realm's
 * first boot has none before it. That figure is a promise on the handle
 * rather than something the join waits for, so taking a seat still resolves
 * as soon as the lock is granted.
 *
 * Resolves to a no-op handle wherever Web Locks are unavailable — the count
 * then reads as "no visible contention", which is the pre-#1711 behavior.
 */
export function joinHandshakeCensus(): Promise<HandshakeCensusSeat> {
    const locks = lockManager();
    if (!locks) {
        return Promise.resolve(NO_CENSUS_SEAT);
    }
    return new Promise((resolve) => {
        let released = false;
        let giveUp: ReturnType<typeof setTimeout> | null = null;
        let settled = false;
        function settle(handle: HandshakeCensusSeat) {
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
                    // Count from inside the grant, so the reading includes
                    // this seat and describes the page the handshake about
                    // to start will actually run on. The query is issued
                    // AFTER a grant, never ahead of a request: a query
                    // immediately before `locks.request` reorders the lock
                    // manager's work and changes which boot wins a rebuild
                    // race (#1713), which is why the count is taken here
                    // rather than beside the caller's own lock operations.
                    // Not awaited before settling below: the seat is handed
                    // over the moment it is granted, exactly as it was
                    // before it carried a count, so a slow query costs the
                    // reading and never the seat.
                    const count = countConcurrentHandshakes().then(
                        (inFlight) => {
                            // The earliest possible refresh of the cache
                            // every later reader consults, taken on a lock
                            // operation that was happening anyway.
                            lastKnownConcurrentHandshakes = inFlight;
                            return inFlight;
                        },
                    );
                    return new Promise<void>((release) => {
                        settle({
                            count,
                            release: () => {
                                released = true;
                                release();
                                // Refresh the cached count as the wave
                                // drains, so it decays with the seats rather
                                // than holding its high-water mark until the
                                // next boot's own refresh lands (a boot after
                                // a busy wave would otherwise size — and
                                // attribute — its first attempt against
                                // pressure that no longer exists). Deferred a
                                // task because the browser frees the lock
                                // when the callback's promise settles, a
                                // microtask after this call: querying then
                                // observes the seat already dropped.
                                setTimeout(
                                    () => refreshHandshakeCensusCount(),
                                    0,
                                );
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
 *
 * What that costs is a first reading: an attempt is answered by the refresh
 * before it, and a realm's first handshake has none. `HandshakeCensusSeat`'s
 * `count` is where that reading comes from instead (#1718) — it arrives while
 * the handshake is already running, so it widens a budget in flight rather
 * than gating one.
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
 * refresh. A boot refreshes once per handshake attempt, every taken census
 * seat records the count it was granted against, and every released one
 * refreshes as it drops — so each attempt's read is answered by the previous
 * attempt's refresh, and a first attempt reads the count as of the last
 * attempt, seat, or drained seat in this realm. A wave in another tab's realm
 * drains invisibly (its releases refresh its own cache, not this one), so the
 * first attempt after one can still read high; the attempt's own refresh
 * corrects the reading for every attempt after it.
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
