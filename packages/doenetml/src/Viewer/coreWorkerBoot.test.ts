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
        // — and its other, healthy documents killed — over CPU pressure.
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

describe("retryDelayMs (#1711)", () => {
    it("backs off exponentially instead of re-piling after a flat delay", () => {
        // Jitter is a [1, 2) multiplier, so compare against the floor of each
        // step rather than an exact value.
        for (let attempt = 0; attempt < 4; attempt++) {
            const base = Math.min(
                CORE_BOOT_RETRY_DELAY_MS * 2 ** attempt,
                MAX_CORE_BOOT_RETRY_DELAY_MS,
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

    it("stays bounded so a retry is never postponed indefinitely", () => {
        for (let i = 0; i < 50; i++) {
            expect(retryDelayMs(20)).toBeLessThan(
                MAX_CORE_BOOT_RETRY_DELAY_MS * 2,
            );
        }
    });
});
