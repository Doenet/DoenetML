import { describe, it, expect, afterEach, vi } from "vitest";
import {
    acquireBootSlot,
    defaultMaxConcurrentBoots,
    GATE_WAIT_TIMEOUT_MS,
} from "./bootGate";
import { doenetGlobalConfig } from "../global-config";

// Unit coverage for the in-realm boot gate (#1710). The gate is a counting
// semaphore over the Web Locks API; these tests drive it against a minimal
// in-memory `navigator.locks` so the concurrency, the fail-open paths, and the
// stand-down-under-a-host-manager rule are all checked without a browser.

type Waiter = { grant: () => void };

/**
 * A `LockManager` good enough for these tests: exclusive locks by name, FIFO
 * waiters, `ifAvailable` returning a null lock when the name is taken, and
 * `signal` dropping a request that has not been granted yet — matching the
 * real API, a grant that already happened ignores a later abort.
 */
function fakeLocks() {
    const held = new Set<string>();
    const waiting = new Map<string, Waiter[]>();

    function release(name: string) {
        const queue = waiting.get(name);
        const next = queue?.shift();
        if (next) {
            next.grant();
        } else {
            held.delete(name);
        }
    }

    return {
        held,
        request(
            name: string,
            options: { ifAvailable?: boolean; signal?: AbortSignal },
            callback: (lock: unknown) => Promise<void>,
        ): Promise<void> {
            if (options.signal?.aborted) {
                return Promise.reject(
                    new DOMException("aborted", "AbortError"),
                );
            }
            const run = () => {
                held.add(name);
                return Promise.resolve(callback({ name })).then(() => {
                    release(name);
                });
            };
            if (!held.has(name)) {
                return run();
            }
            if (options.ifAvailable) {
                return Promise.resolve(callback(null)).then(() => {});
            }
            return new Promise<void>((settle, reject) => {
                const queue = waiting.get(name) ?? [];
                const waiter: Waiter = { grant: () => settle(run()) };
                queue.push(waiter);
                waiting.set(name, queue);
                options.signal?.addEventListener("abort", () => {
                    const parked = waiting.get(name);
                    const at = parked?.indexOf(waiter) ?? -1;
                    if (parked && at !== -1) {
                        parked.splice(at, 1);
                        reject(new DOMException("aborted", "AbortError"));
                    }
                });
            });
        },
    };
}

function installLocks(locks: unknown, hardwareConcurrency = 4) {
    Object.defineProperty(globalThis, "navigator", {
        value: { locks, hardwareConcurrency },
        configurable: true,
        writable: true,
    });
}

describe("boot gate (#1710)", () => {
    afterEach(() => {
        delete doenetGlobalConfig.externallyManagedBoot;
        vi.useRealTimers();
    });

    it("sizes the default cap from the hardware, between a floor of 2 and a ceiling of 6", () => {
        // Half the reported threads: 4 — the machine from #1707 — gives 2.
        installLocks(fakeLocks(), 4);
        expect(defaultMaxConcurrentBoots()).toBe(2);
        installLocks(fakeLocks(), 8);
        expect(defaultMaxConcurrentBoots()).toBe(4);
        // The floor keeps a page from serializing completely; the ceiling
        // keeps a many-core machine from reintroducing the stampede.
        installLocks(fakeLocks(), 2);
        expect(defaultMaxConcurrentBoots()).toBe(2);
        installLocks(fakeLocks(), 64);
        expect(defaultMaxConcurrentBoots()).toBe(6);
        // A browser that withholds the hint is not evidence of a fast machine.
        installLocks(fakeLocks(), 0);
        expect(defaultMaxConcurrentBoots()).toBe(2);
    });

    it("admits up to the cap and makes the next boot wait for a release", async () => {
        installLocks(fakeLocks());

        const first = await acquireBootSlot(2);
        const second = await acquireBootSlot(2);

        // Both slots are taken, so a third must wait rather than resolve.
        let thirdResolved = false;
        const third = acquireBootSlot(2).then((slot) => {
            thirdResolved = true;
            return slot;
        });
        await Promise.resolve();
        await Promise.resolve();
        expect(thirdResolved).toBe(false);

        // Releasing ONE slot must serve the waiter, whichever slot frees:
        // the waiter queues on every slot and takes the first grant, so no
        // free capacity sits idle while a boot waits behind a busier slot.
        first.release();
        const grantedThird = await third;
        expect(thirdResolved).toBe(true);
        grantedThird.release();
        second.release();
    });

    it("withdraws a served waiter's other queued requests", async () => {
        const locks = fakeLocks();
        installLocks(locks);

        // Fill both slots, then queue a waiter — on both slots, per the
        // work-conserving slow path.
        const first = await acquireBootSlot(2);
        const second = await acquireBootSlot(2);
        const third = acquireBootSlot(2);
        await Promise.resolve();
        await Promise.resolve();

        // Serve the waiter from the first slot. Its request still queued on
        // the second must be withdrawn with it — not left behind to grab
        // that slot when it frees.
        first.release();
        const grantedThird = await third;
        second.release();
        await Promise.resolve();
        await Promise.resolve();
        expect(locks.held.size).toBe(1);
        grantedThird.release();
        await Promise.resolve();
        await Promise.resolve();
        expect(locks.held.size).toBe(0);
    });

    it("stands down when a host manager already schedules boots", async () => {
        const locks = fakeLocks();
        installLocks(locks);
        doenetGlobalConfig.externallyManagedBoot = true;

        // Far more concurrent boots than the cap would ever allow: none of
        // them may block, and none may take a lock — nesting this gate under
        // a host cap is what serializes a managed page.
        const slots = await Promise.all(
            Array.from({ length: 5 }, () => acquireBootSlot(1)),
        );
        expect(slots).toHaveLength(5);
        expect(locks.held.size).toBe(0);
        slots.forEach((slot) => slot.release());
    });

    it("boots ungated when the browser has no Web Locks", async () => {
        installLocks(undefined);

        const slots = await Promise.all(
            Array.from({ length: 4 }, () => acquireBootSlot(1)),
        );
        expect(slots).toHaveLength(4);
        slots.forEach((slot) => slot.release());
    });

    it("boots ungated when a lock request throws", async () => {
        installLocks({
            request: () => {
                throw new Error("locks unavailable in this context");
            },
        });

        // Must resolve, not reject: a gate that cannot be used has to degrade
        // to today's ungated behavior, never to a document that never boots.
        const slot = await acquireBootSlot(1);
        expect(slot).toBeDefined();
        slot.release();
    });

    it("boots ungated rather than waiting on a slot forever", async () => {
        // The third fail-open path, and the one that is not an absent API: a
        // slot that never frees. A boot that waits indefinitely is invisible
        // and unrecoverable, so past the backstop the gate stands aside.
        vi.useFakeTimers();
        installLocks(fakeLocks());
        const holder = await acquireBootSlot(1);

        let bypassed = false;
        const queued = acquireBootSlot(1).then((slot) => {
            bypassed = true;
            return slot;
        });

        // Still queued well into the wait — the backstop is a backstop, not a
        // short-circuit around the gate.
        await vi.advanceTimersByTimeAsync(GATE_WAIT_TIMEOUT_MS - 1);
        expect(bypassed).toBe(false);

        await vi.advanceTimersByTimeAsync(2);
        const slot = await queued;
        expect(bypassed).toBe(true);
        // The bypassed boot holds nothing, so releasing it cannot free the
        // slot the original holder still has.
        slot.release();
        holder.release();
    });

    it("releasing twice does not hand out an extra slot", async () => {
        const locks = fakeLocks();
        installLocks(locks);

        const slot = await acquireBootSlot(1);
        slot.release();
        slot.release();
        // The lock's own cleanup runs when the callback's promise settles, a
        // microtask after `release`.
        await Promise.resolve();
        await Promise.resolve();
        expect(locks.held.size).toBe(0);

        // The cap still holds afterwards.
        const next = await acquireBootSlot(1);
        expect(locks.held.size).toBe(1);
        next.release();
    });
});
