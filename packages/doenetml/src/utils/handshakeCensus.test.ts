import { describe, it, expect } from "vitest";
import {
    countConcurrentHandshakes,
    joinHandshakeCensus,
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
    });

    it("reports a neutral 1 when the browser cannot answer", async () => {
        // No Web Locks at all, and a query that rejects: both must read as
        // "no visible contention" so the watchdog falls back to its fixed
        // base rather than to zero (which would scale to nonsense).
        installLocks(undefined);
        expect(await countConcurrentHandshakes()).toBe(1);
        const noop = await joinHandshakeCensus();
        expect(noop).toBeDefined();
        noop.release();

        installLocks({
            request: () => Promise.resolve(),
            query: () => Promise.reject(new Error("unavailable")),
        });
        expect(await countConcurrentHandshakes()).toBe(1);
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
        expect(seat).toBeDefined();
        seat.release();
    });
});
