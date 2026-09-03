import { describe, it, expect } from "vitest";
import {
    handshakeWatchdogMsFor,
    isHandshakeTimeout,
    timeoutLooksLikeContention,
    retryDelayMs,
    withTimeout,
    DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS,
    MAX_CORE_HANDSHAKE_WATCHDOG_MS,
    CORE_BOOT_RETRY_DELAY_MS,
    MAX_CORE_BOOT_RETRY_DELAY_MS,
} from "./coreWorkerBoot";

// Unit coverage for the contention-aware handshake budget (#1711).
//
// The fixed 15 s watchdog was measured on developer hardware. On the 1.1 GHz
// dual-core machine in #1707, a page of activities booting at once pushed a
// healthy handshake past it and the documents failed outright. These tests pin
// the two directions that matter: the budget widens under real pressure, and
// an idle page still detects a genuine hang as fast as it used to.

describe("handshakeWatchdogMsFor (#1711)", () => {
    it("leaves an uncontended page at the historical budget", () => {
        expect(
            handshakeWatchdogMsFor({
                concurrentHandshakes: 1,
                hardwareConcurrency: 4,
            }),
        ).toBe(DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS);
    });

    it("does not widen while the machine can still work on every handshake", () => {
        // 4 handshakes on 4 cores is one each — pressure 1, not contention.
        expect(
            handshakeWatchdogMsFor({
                concurrentHandshakes: 4,
                hardwareConcurrency: 4,
            }),
        ).toBe(DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS);
    });

    it("widens in proportion to handshakes per core", () => {
        // The reported machine: 4 threads, a section's worth of activities.
        expect(
            handshakeWatchdogMsFor({
                concurrentHandshakes: 8,
                hardwareConcurrency: 4,
            }),
        ).toBe(DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS * 2);
        expect(
            handshakeWatchdogMsFor({
                concurrentHandshakes: 12,
                hardwareConcurrency: 4,
            }),
        ).toBe(DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS * 3);
    });

    it("caps the budget so a true hang is still recovered from", () => {
        expect(
            handshakeWatchdogMsFor({
                concurrentHandshakes: 500,
                hardwareConcurrency: 2,
            }),
        ).toBe(MAX_CORE_HANDSHAKE_WATCHDOG_MS);
    });

    it("treats a missing hardwareConcurrency as a single core", () => {
        // Absent the hint, assume the worst rather than the best: a machine
        // that will not say how many cores it has is not a fast one.
        expect(
            handshakeWatchdogMsFor({
                concurrentHandshakes: 2,
                hardwareConcurrency: 0,
            }),
        ).toBe(DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS * 2);
    });

    it("honors an explicit base", () => {
        expect(
            handshakeWatchdogMsFor({
                concurrentHandshakes: 1,
                hardwareConcurrency: 4,
                baseMs: 500,
            }),
        ).toBe(500);
    });
});

describe("timeoutLooksLikeContention (#1711)", () => {
    it("is false on an idle page, so a genuine hang still quarantines", () => {
        expect(
            timeoutLooksLikeContention({
                concurrentHandshakes: 1,
                hardwareConcurrency: 4,
            }),
        ).toBe(false);
    });

    it("is false while the machine can service every handshake", () => {
        expect(
            timeoutLooksLikeContention({
                concurrentHandshakes: 4,
                hardwareConcurrency: 4,
            }),
        ).toBe(false);
    });

    it("is true once handshakes outnumber cores", () => {
        // This is what stops a shared core-worker host from being quarantined
        // — and retries pushed onto a cold replacement host — over CPU
        // pressure.
        expect(
            timeoutLooksLikeContention({
                concurrentHandshakes: 6,
                hardwareConcurrency: 4,
            }),
        ).toBe(true);
    });
});

describe("isHandshakeTimeout (#1711)", () => {
    // Contention only ever explains a watchdog expiry. If a plain rejection
    // could pass for one, a 404 on the worker script would be reported to the
    // reader as a busy page, and would waive the wedge suspicion that a
    // definite error is entitled to.
    it("recognizes the rejection the watchdog itself raises", async () => {
        const err = await withTimeout(
            () => new Promise<void>(() => {}),
            1,
            "never settles",
        ).catch((e) => e);
        expect(isHandshakeTimeout(err)).toBe(true);
    });

    it("does not claim a task's own rejection", async () => {
        const err = await withTimeout(
            () => Promise.reject(new Error("worker script 404")),
            10_000,
            "rejects outright",
        ).catch((e) => e);
        expect(isHandshakeTimeout(err)).toBe(false);
    });

    it("tolerates a non-error rejection value", () => {
        expect(isHandshakeTimeout(undefined)).toBe(false);
        expect(isHandshakeTimeout(null)).toBe(false);
        expect(isHandshakeTimeout("timed out")).toBe(false);
    });
});

describe("withTimeout widening (#1718)", () => {
    // A realm's first handshake has no cached census reading to size itself
    // against, and the one its own seat brings back arrives after the
    // handshake has started. Rather than make the boot wait for it — extra
    // awaits in `startCore` are what let a catalog-driven rebuild overlap the
    // ladder already running, which is why the count is cached rather than
    // asked for — the budget starts at the uncontended base and moves out when
    // the count lands.

    it("extends a running deadline when the wider budget arrives", async () => {
        // The task outlives the budget it started with, and finishes well
        // inside the one that arrives a microtask later.
        const value = await withTimeout(
            () =>
                new Promise<string>((resolve) =>
                    setTimeout(() => resolve("handshook"), 120),
                ),
            30,
            "widened while running",
            { widenedMs: Promise.resolve(5_000) },
        );
        expect(value).toBe("handshook");
    });

    it("never narrows a deadline already granted", async () => {
        // A seat that saw a quieter page than the cache did must leave the
        // budget alone: erring long is the deliberate bias throughout the
        // ladder, and a late answer must not cut a healthy handshake short.
        const value = await withTimeout(
            () =>
                new Promise<string>((resolve) =>
                    setTimeout(() => resolve("handshook"), 60),
                ),
            5_000,
            "not narrowed",
            { widenedMs: Promise.resolve(1) },
        );
        expect(value).toBe("handshook");
    });

    it("reports the budget that actually expired", async () => {
        // The message is what a reader gets in the console alongside the
        // failure, so it has to name the widened deadline, not the one the
        // attempt opened with.
        const err = await withTimeout(
            () => new Promise<void>(() => {}),
            1,
            "hangs",
            { widenedMs: Promise.resolve(40) },
        ).catch((e) => e);
        expect(isHandshakeTimeout(err)).toBe(true);
        expect(String((err as Error).message)).toContain("40ms");
    });

    it("keeps its deadline when the budget never arrives", async () => {
        // The census is best-effort everywhere else; a reading that fails to
        // materialize leaves the attempt exactly as it was — same deadline,
        // and a message still naming the budget it opened with.
        const err = await withTimeout(
            () => new Promise<void>(() => {}),
            1,
            "hangs",
            { widenedMs: Promise.reject(new Error("no census")) },
        ).catch((e) => e);
        expect(isHandshakeTimeout(err)).toBe(true);
        expect(String((err as Error).message)).toContain("1ms");
    });
});

describe("withTimeout restart (#1533)", () => {
    // A boot restarted mid-handshake waits its turn behind the initialization
    // already in flight on its worker. Counted against one budget, two healthy
    // handshakes back to back would overrun it on a slow machine and discard a
    // worker that was working. So the budget is counted afresh from the turn,
    // while the wait before it is still bounded.

    /** A task that waits `waitMs` for its turn, then works for `workMs`. */
    function queuedTask(waitMs: number, workMs: number) {
        let turn = () => {};
        const turnCame = new Promise<void>((resolve) => {
            turn = resolve;
        });
        function task() {
            return new Promise<string>((resolve) => {
                setTimeout(() => {
                    turn();
                    setTimeout(() => resolve("handshook"), workMs);
                }, waitMs);
            });
        }
        return { task, turnCame };
    }

    it("counts the budget from the turn, not from the start", async () => {
        // Waiting and working each take most of the budget; only a deadline
        // re-based at the turn lets the work finish.
        const { task, turnCame } = queuedTask(100, 100);
        const value = await withTimeout(task, 150, "re-based at the turn", {
            restartAt: turnCame,
        });
        expect(value).toBe("handshook");
    });

    it("still bounds a wait for a turn that never comes", async () => {
        const err = await withTimeout(
            () => new Promise<void>(() => {}),
            20,
            "no turn",
            { restartAt: new Promise<void>(() => {}) },
        ).catch((e) => e);
        expect(isHandshakeTimeout(err)).toBe(true);
    });

    it("counts a widening granted before the turn from the turn", async () => {
        // The seat's wider budget is the one in force when the turn comes, so
        // that is what the turn counts from.
        const { task, turnCame } = queuedTask(30, 100);
        const value = await withTimeout(task, 10, "widened then re-based", {
            widenedMs: Promise.resolve(200),
            restartAt: turnCame,
        });
        expect(value).toBe("handshook");
    });
});

describe("retryDelayMs (#1711)", () => {
    it("backs off exponentially instead of re-piling after a flat delay", () => {
        // Jitter is a [1, 2) multiplier, so compare against the floor of each
        // step rather than an exact value.
        for (let attempt = 0; attempt < 4; attempt++) {
            const base = Math.min(
                CORE_BOOT_RETRY_DELAY_MS * 2 ** attempt,
                MAX_CORE_BOOT_RETRY_DELAY_MS / 2,
            );
            for (let i = 0; i < 50; i++) {
                const delay = retryDelayMs(attempt);
                expect(delay).toBeGreaterThanOrEqual(base);
                expect(delay).toBeLessThan(base * 2);
            }
        }
    });

    it("grows between successive attempts", () => {
        // Minimum of a later attempt exceeds the maximum of the first, so the
        // ladder genuinely spreads out rather than merely jittering.
        const firstMax = CORE_BOOT_RETRY_DELAY_MS * 2;
        for (let i = 0; i < 50; i++) {
            expect(retryDelayMs(2)).toBeGreaterThan(firstMax);
        }
    });

    it("keeps every jittered delay under the advertised cap", () => {
        // The cap applies to the delay actually slept, jitter included: the
        // pre-jitter value is capped at half the max, so even a doubled
        // jitter draw lands below `MAX_CORE_BOOT_RETRY_DELAY_MS` — while a
        // capped attempt still spans the jitter's full [1, 2) spread rather
        // than collapsing onto a single value every sibling shares.
        for (const attempt of [4, 10, 20, 40]) {
            for (let i = 0; i < 50; i++) {
                const delay = retryDelayMs(attempt);
                expect(delay).toBeLessThan(MAX_CORE_BOOT_RETRY_DELAY_MS);
                expect(delay).toBeGreaterThanOrEqual(
                    MAX_CORE_BOOT_RETRY_DELAY_MS / 2,
                );
            }
        }
    });
});
