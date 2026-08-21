import { describe, it, expect } from "vitest";
import {
    HANDSHAKE_CENSUS_LOCK,
    concurrentHandshakesSnapshot,
    countConcurrentHandshakes,
    joinHandshakeCensus,
    refreshHandshakeCensusCount,
} from "./handshakeCensus";

// Unit coverage for the handshake census (#1711) — the page-wide count of
// in-flight core handshakes the adaptive watchdog reads its contention from.
// Driven against a minimal in-memory `navigator.locks` so both the counting
// and the "browser cannot answer" fallbacks are checked without a browser.

function installLocks(locks: unknown, hardwareConcurrency = 4) {
    Object.defineProperty(globalThis, "navigator", {
        value: { locks, hardwareConcurrency },
        configurable: true,
        writable: true,
    });
}

/** A `LockManager` that understands `shared` mode and `query()`. */
function fakeSharedLocks() {
    const held: { name: string; mode: string }[] = [];
    return {
        request(
            name: string,
            options: { mode?: string },
            callback: (lock: unknown) => Promise<void>,
        ): Promise<void> {
            const entry = { name, mode: options.mode ?? "exclusive" };
            held.push(entry);
            return Promise.resolve(callback({ name })).then(() => {
                const index = held.indexOf(entry);
                if (index !== -1) {
                    held.splice(index, 1);
                }
            });
        },
        query() {
            return Promise.resolve({ held: held.map((h) => ({ ...h })) });
        },
    };
}

/**
 * Let the refreshes a released seat defers by a task run, and the queries they
 * issue settle, so the cached count reflects the seats that have dropped
 * before the next assertion — or the next test — reads it.
 */
async function drainDeferredRefreshes() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("handshake census (#1711)", () => {
    it("counts concurrent handshakes across realms and drops them on release", async () => {
        installLocks(fakeSharedLocks());

        expect(await countConcurrentHandshakes()).toBe(1);

        // Three realms mid-handshake. Shared mode, so none of them blocks —
        // this is bookkeeping, not admission control.
        const a = await joinHandshakeCensus();
        const b = await joinHandshakeCensus();
        const c = await joinHandshakeCensus();
        expect(await countConcurrentHandshakes()).toBe(3);

        a.release();
        b.release();
        await Promise.resolve();
        await Promise.resolve();
        expect(await countConcurrentHandshakes()).toBe(1);

        c.release();
        await drainDeferredRefreshes();
    });

    it("reports the count its own seat was granted against", async () => {
        // The reading a FIRST handshake gets (#1718): the cached snapshot
        // answers with the refresh before the caller's own, and a realm's
        // first boot has none before it, so the seat has to bring the count
        // back itself — counted from inside the grant, so it includes the
        // seat being taken.
        installLocks(fakeSharedLocks());

        const first = await joinHandshakeCensus();
        expect(await first.count).toBe(1);
        const second = await joinHandshakeCensus();
        expect(await second.count).toBe(2);
        // Taking a seat is also the cache's earliest possible refresh, so a
        // retry does not have to wait for one of its own either.
        expect(concurrentHandshakesSnapshot()).toBe(2);

        first.release();
        second.release();
        await drainDeferredRefreshes();
    });

    it("hands the seat over before its count is known", async () => {
        // The count must never be something the join waits for: a query that
        // is slow — on exactly the loaded machine this census exists for —
        // would otherwise run the join past `CENSUS_JOIN_TIMEOUT_MS` and cost
        // the realm its seat, leaving it invisible to the siblings sizing
        // watchdogs against it.
        let answerQuery: (state: {
            held: { name: string }[];
        }) => void = () => {};
        installLocks({
            request: (
                _name: string,
                _options: unknown,
                callback: (lock: unknown) => Promise<void>,
            ) => Promise.resolve(callback({})),
            query: () =>
                new Promise((resolve) => {
                    answerQuery = resolve;
                }),
        });

        // The seat is handed over with the grant, so this resolves while the
        // query is still outstanding — nothing answers it until the line
        // below. A join that waited for the count would instead run out
        // `CENSUS_JOIN_TIMEOUT_MS` and settle to the uncounted no-op seat,
        // whose neutral 1 is what the assertion below would then read.
        const seat = await joinHandshakeCensus();
        answerQuery({
            held: [
                { name: HANDSHAKE_CENSUS_LOCK },
                { name: HANDSHAKE_CENSUS_LOCK },
            ],
        });
        expect(await seat.count).toBe(2);
        seat.release();
        await drainDeferredRefreshes();
    });

    it("reports a neutral 1 when the browser cannot answer", async () => {
        // No Web Locks at all, and a query that rejects: both must read as
        // "no visible contention" so the watchdog falls back to its fixed
        // base rather than to zero (which would scale to nonsense).
        installLocks(undefined);
        expect(await countConcurrentHandshakes()).toBe(1);
        const noop = await joinHandshakeCensus();
        expect(await noop.count).toBe(1);
        noop.release();

        installLocks({
            request: () => Promise.resolve(),
            query: () => Promise.reject(new Error("unavailable")),
        });
        expect(await countConcurrentHandshakes()).toBe(1);
    });

    it("decays the cached count as seats release, without a caller refresh", async () => {
        // The cached snapshot must not hold a busy wave's high-water mark
        // after the wave drains: the next boot sizes and attributes its
        // first attempt against this number before its own refresh lands.
        installLocks(fakeSharedLocks());

        const seats = await Promise.all([
            joinHandshakeCensus(),
            joinHandshakeCensus(),
            joinHandshakeCensus(),
        ]);
        refreshHandshakeCensusCount();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(concurrentHandshakesSnapshot()).toBe(3);

        seats.forEach((seat) => seat.release());
        await drainDeferredRefreshes();
        expect(concurrentHandshakesSnapshot()).toBe(1);
    });

    it("joins as the no-op seat when the lock request throws", async () => {
        // A synchronous throw, distinct from the rejected promise above: the
        // join must resolve to the no-op seat either way, never reject —
        // callers attach their handlers after the boot is already underway.
        installLocks({
            request: () => {
                throw new Error("locks unavailable in this context");
            },
        });

        const seat = await joinHandshakeCensus();
        expect(await seat.count).toBe(1);
        seat.release();
    });
});
