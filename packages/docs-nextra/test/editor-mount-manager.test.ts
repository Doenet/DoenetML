import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
    __resetEditorMountManagerForTests as reset,
    cancelMountRequest,
    getEditorMountStats as stats,
    notifyEditorState,
    registerEditor,
    releaseMountSlot,
    reportEditorVisibility,
    requestMountSlot,
} from "../components/editor-mount-manager";

/**
 * Unit tests for the page-wide editor windowing policy engine (#1441 stream B,
 * docs host). The manager is pure policy — no React, no DOM — so these drive
 * its API directly and assert via `getEditorMountStats()` and the `grant` /
 * `requestEvict` spies. Fake timers make the `parkDelayMs` debounce and the
 * coalesced `scheduleEvaluate` deterministic.
 */

const DELAY = 2000;

/** Register an editor with the given knobs; returns its spies + unregister. */
function makeEditor(
    id: string,
    {
        maxLive = 10,
        maxConcurrentBoots = 10,
    }: { maxLive?: number; maxConcurrentBoots?: number } = {},
) {
    const requestEvict = vi.fn();
    const unregister = registerEditor({
        id,
        maxLive,
        maxConcurrentBoots,
        parkDelayMs: DELAY,
        requestEvict,
    });
    return { id, requestEvict, unregister };
}

/** Drive an editor to "mounted" after having been visible then scrolled off. */
function mountOffScreen(id: string) {
    reportEditorVisibility(id, true); // stamps recency order
    reportEditorVisibility(id, false); // starts the off-screen debounce
    notifyEditorState(id, "mounted");
}

beforeEach(() => {
    reset();
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
});

describe("boot-slot semaphore", () => {
    test("caps concurrent grants and queues the rest, granting on release", () => {
        const grants = [vi.fn(), vi.fn(), vi.fn()];
        ["a", "b", "c"].forEach((id) =>
            makeEditor(id, { maxConcurrentBoots: 2 }),
        );
        ["a", "b", "c"].forEach((id, i) => requestMountSlot(id, grants[i]));

        expect(grants[0]).toHaveBeenCalledTimes(1);
        expect(grants[1]).toHaveBeenCalledTimes(1);
        expect(grants[2]).not.toHaveBeenCalled();
        expect(stats()).toMatchObject({ booting: 2, bootQueue: 1 });

        releaseMountSlot("a");
        expect(grants[2]).toHaveBeenCalledTimes(1);
        expect(stats()).toMatchObject({ booting: 2, bootQueue: 0 });
    });

    test("ignores a duplicate request for an id already holding a slot", () => {
        makeEditor("a", { maxConcurrentBoots: 2 });
        const grant = vi.fn();
        requestMountSlot("a", grant);
        requestMountSlot("a", grant);
        expect(grant).toHaveBeenCalledTimes(1);
        expect(stats()).toMatchObject({ booting: 1, bootQueue: 0 });
    });

    test("cancelMountRequest withdraws a queued (not-yet-granted) request", () => {
        const g = { a: vi.fn(), b: vi.fn(), c: vi.fn() };
        ["a", "b", "c"].forEach((id) =>
            makeEditor(id, { maxConcurrentBoots: 1 }),
        );
        requestMountSlot("a", g.a); // granted (cap 1)
        requestMountSlot("b", g.b); // queued
        requestMountSlot("c", g.c); // queued
        expect(stats().bootQueue).toBe(2);

        cancelMountRequest("b");
        expect(stats().bootQueue).toBe(1);

        releaseMountSlot("a");
        expect(g.b).not.toHaveBeenCalled();
        expect(g.c).toHaveBeenCalledTimes(1);
    });

    test("releaseMountSlot is idempotent — a stale release grants nothing extra", () => {
        const g = { a: vi.fn(), b: vi.fn() };
        ["a", "b"].forEach((id) => makeEditor(id, { maxConcurrentBoots: 1 }));
        requestMountSlot("a", g.a);
        requestMountSlot("b", g.b);

        releaseMountSlot("a");
        expect(g.b).toHaveBeenCalledTimes(1);

        releaseMountSlot("a"); // already released
        releaseMountSlot("a");
        expect(g.b).toHaveBeenCalledTimes(1);
        expect(stats().booting).toBe(1); // only b holds a slot
    });

    test("a freed slot goes to a visible waiter first, then by request order", () => {
        const g = { a: vi.fn(), b: vi.fn(), c: vi.fn() };
        ["a", "b", "c"].forEach((id) =>
            makeEditor(id, { maxConcurrentBoots: 1 }),
        );
        requestMountSlot("a", g.a); // granted (cap 1)
        requestMountSlot("b", g.b); // queued first
        requestMountSlot("c", g.c); // queued second
        reportEditorVisibility("c", true); // c visible → should win over b

        releaseMountSlot("a");
        expect(g.c).toHaveBeenCalledTimes(1);
        expect(g.b).not.toHaveBeenCalled();
    });
});

describe("live-count budget + eviction", () => {
    test("evicts the least-recently-visible off-screen editor when over budget", () => {
        const e = ["e0", "e1", "e2", "e3"].map((id) =>
            makeEditor(id, { maxLive: 3 }),
        );
        // Recency e0 (oldest) … e3 (newest); all now off-screen and mounted.
        e.forEach(({ id }) => mountOffScreen(id));
        expect(stats().mounted).toBe(4);

        vi.advanceTimersByTime(DELAY);
        expect(e[0].requestEvict).toHaveBeenCalledTimes(1); // least-recently-visible
        e.slice(1).forEach(({ requestEvict }) =>
            expect(requestEvict).not.toHaveBeenCalled(),
        );
        expect(stats()).toMatchObject({ mounted: 3, unmounting: 1 });

        notifyEditorState("e0", "unmounted"); // wrapper confirms the unload
        expect(stats()).toMatchObject({
            mounted: 3,
            unmounting: 0,
            unmounted: 1,
        });
    });

    test("never evicts a currently-visible editor (soft budget)", () => {
        const e = ["e0", "e1", "e2", "e3"].map((id) =>
            makeEditor(id, { maxLive: 3 }),
        );
        e.forEach(({ id }) => {
            reportEditorVisibility(id, true);
            notifyEditorState(id, "mounted");
        });

        vi.advanceTimersByTime(10 * DELAY);
        e.forEach(({ requestEvict }) =>
            expect(requestEvict).not.toHaveBeenCalled(),
        );
        expect(stats().mounted).toBe(4);
    });

    test("waits out parkDelayMs before evicting an off-screen editor", () => {
        const e = ["e0", "e1", "e2", "e3"].map((id) =>
            makeEditor(id, { maxLive: 3 }),
        );
        e.forEach(({ id }) => mountOffScreen(id));

        vi.advanceTimersByTime(DELAY - 1);
        e.forEach(({ requestEvict }) =>
            expect(requestEvict).not.toHaveBeenCalled(),
        );

        vi.advanceTimersByTime(1);
        expect(e[0].requestEvict).toHaveBeenCalledTimes(1);
    });

    test("evicts exactly the excess and does not double-evict while unmounting", () => {
        const e = ["e0", "e1", "e2", "e3", "e4"].map((id) =>
            makeEditor(id, { maxLive: 3 }),
        );
        e.forEach(({ id }) => mountOffScreen(id));

        vi.advanceTimersByTime(DELAY);
        const evicted = () =>
            e.filter(
                ({ requestEvict }) => requestEvict.mock.calls.length === 1,
            );
        expect(evicted().map((x) => x.id)).toEqual(["e0", "e1"]); // 5 mounted − 3 budget
        expect(stats()).toMatchObject({ mounted: 3, unmounting: 2 });

        // A re-evaluation triggered while the two are still unmounting must not
        // shed more (they no longer count against the budget).
        notifyEditorState("e0", "unmounted");
        vi.advanceTimersByTime(DELAY);
        expect(evicted()).toHaveLength(2);
    });

    test("the effective live budget is the smallest across registrations", () => {
        const e0 = makeEditor("e0", { maxLive: 5 });
        makeEditor("e1", { maxLive: 2 }); // smallest → page budget is 2
        const e2 = makeEditor("e2", { maxLive: 5 });
        ["e0", "e1", "e2"].forEach(mountOffScreen);

        vi.advanceTimersByTime(DELAY);
        expect(e0.requestEvict).toHaveBeenCalledTimes(1); // least-recently-visible over the budget of 2
        expect(e2.requestEvict).not.toHaveBeenCalled();
        expect(stats().mounted).toBe(2);
    });
});

describe("registration lifecycle", () => {
    test("unregister releases a held boot slot and pumps the queue", () => {
        const a = makeEditor("a", { maxConcurrentBoots: 1 });
        makeEditor("b", { maxConcurrentBoots: 1 });
        const gA = vi.fn();
        const gB = vi.fn();
        requestMountSlot("a", gA); // granted (cap 1)
        requestMountSlot("b", gB); // queued
        expect(gB).not.toHaveBeenCalled();

        a.unregister(); // frees the slot → b is granted
        expect(gB).toHaveBeenCalledTimes(1);
        expect(stats().registered).toBe(1);
    });

    test("__resetEditorMountManagerForTests clears all state", () => {
        makeEditor("a", { maxLive: 3, maxConcurrentBoots: 2 });
        requestMountSlot("a", vi.fn());
        mountOffScreen("a");

        reset();
        expect(stats()).toEqual({
            registered: 0,
            mounted: 0,
            unmounting: 0,
            unmounted: 0,
            booting: 0,
            bootQueue: 0,
        });
    });
});
