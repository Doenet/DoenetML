/**
 * Page-wide lifecycle manager for windowed editor examples in the docs site
 * (#1441 stream B, docs host).
 *
 * The iframe `<DoenetViewer>` has a built-in windowed `mountPolicy`, but the
 * iframe `<DoenetEditor>` does not — and editors are the dominant example type
 * in the docs. This module is the editor counterpart: a deliberately
 * simplified sibling of `@doenet/doenetml-iframe`'s `viewer-lifecycle-manager`
 * (whose register/boot-slot functions are internal and not exported, so they
 * cannot be reused). It owns two page-wide budgets:
 *
 * - a live-count budget with least-recently-visible eviction (unload the
 *   off-screen editors beyond `maxLive`), and
 * - a boot-slot semaphore (`maxConcurrentBoots`) that caps how many editors
 *   evaluate the multi-MB standalone bundle at once, visible-first.
 *
 * It is pure policy (no React, no DOM): *when* an editor may mount and *when*
 * it must unload. The `WindowedEditor` wrapper owns the mechanics (the
 * `IntersectionObserver`, mounting/unmounting the iframe) and reports outcomes
 * back here. Editor eviction is always safe — unloading a docs editor just
 * reboots it from its documented source — so, unlike the viewer manager, there
 * is no persistence/`canPark` gate and no state-flush handshake. Module-level
 * state is intentional: the budget is shared by every editor on the page.
 *
 * Rules (mirroring the viewer manager):
 * - A currently-visible editor is never unloaded (the budget is soft).
 * - An editor is eligible to unload only after `parkDelayMs` off-screen.
 * - Eviction order is least-recently-visible first.
 */

/** "mounted" = live iframe; "unmounting" = eviction in flight; "unmounted" = placeholder. */
export type EditorMountState = "mounted" | "unmounting" | "unmounted";

type EditorRecord = {
    id: string;
    state: EditorMountState;
    visible: boolean;
    /** Monotonic counter value from when this editor was last visible. */
    lastVisibleOrder: number;
    /** Timestamp when this editor last became invisible. */
    invisibleSince: number;
    parkDelayMs: number;
    /** Ask the wrapper to unload (unmount the iframe, show the placeholder). */
    requestEvict: () => void;
};

const records = new Map<string, EditorRecord>();
let visibleOrderCounter = 0;
let effectiveMaxLive: number | null = null;

let evaluateTimerId: ReturnType<typeof setTimeout> | null = null;
let evaluateTimerAt = Infinity;

// ---- Boot-slot semaphore ----
// Caps how many editors boot their iframe realm simultaneously.
let effectiveMaxBoots: number | null = null;
const bootSlotHolders = new Set<string>();
type BootRequest = { id: string; requestOrder: number; grant: () => void };
let bootRequestCounter = 0;
const bootQueue: BootRequest[] = [];

/**
 * Register an editor. It starts as a placeholder (`"unmounted"`) and only
 * counts against the live budget once it actually mounts. Returns an
 * unregister function for the wrapper's unmount cleanup.
 */
export function registerEditor({
    id,
    maxLive,
    maxConcurrentBoots,
    parkDelayMs,
    requestEvict,
}: {
    id: string;
    maxLive: number;
    maxConcurrentBoots: number;
    parkDelayMs: number;
    requestEvict: () => void;
}): () => void {
    effectiveMaxBoots =
        effectiveMaxBoots === null
            ? maxConcurrentBoots
            : Math.min(effectiveMaxBoots, maxConcurrentBoots);
    effectiveMaxLive =
        effectiveMaxLive === null
            ? maxLive
            : Math.min(effectiveMaxLive, maxLive);

    records.set(id, {
        id,
        state: "unmounted",
        visible: false,
        lastVisibleOrder: 0,
        invisibleSince: Date.now(),
        parkDelayMs,
        requestEvict,
    });

    return () => {
        records.delete(id);
        cancelMountRequest(id);
        releaseMountSlot(id);
        scheduleEvaluate(0);
    };
}

/**
 * Request a boot slot; `grant` is called (synchronously when a slot is free)
 * once this editor may create its iframe. Visible editors are served before
 * off-screen ones, then request order. A duplicate request for an id already
 * queued or already holding a slot is ignored.
 */
export function requestMountSlot(id: string, grant: () => void) {
    if (bootSlotHolders.has(id) || bootQueue.some((r) => r.id === id)) {
        return;
    }
    bootQueue.push({ id, requestOrder: ++bootRequestCounter, grant });
    grantBootSlots();
}

/** Withdraw a queued boot request (e.g. the editor scrolled away again). */
export function cancelMountRequest(id: string) {
    const idx = bootQueue.findIndex((r) => r.id === id);
    if (idx !== -1) {
        bootQueue.splice(idx, 1);
    }
}

/**
 * Release a held boot slot (the editor finished booting, was evicted, or
 * unregistered). Idempotent.
 */
export function releaseMountSlot(id: string) {
    if (bootSlotHolders.delete(id)) {
        grantBootSlots();
    }
}

/**
 * Hand free boot slots to waiting editors, up to the concurrency cap, choosing
 * visible editors first and then by request order. Called whenever a slot may
 * have opened up (a boot finished/was released) or a new waiter joined the
 * queue.
 */
function grantBootSlots() {
    const max = effectiveMaxBoots ?? Infinity;
    while (bootQueue.length > 0 && bootSlotHolders.size < max) {
        // Visible-first, then request order.
        let best = 0;
        for (let i = 1; i < bootQueue.length; i++) {
            const bestVisible = Boolean(
                records.get(bootQueue[best].id)?.visible,
            );
            const thisVisible = Boolean(records.get(bootQueue[i].id)?.visible);
            if (
                (thisVisible && !bestVisible) ||
                (thisVisible === bestVisible &&
                    bootQueue[i].requestOrder < bootQueue[best].requestOrder)
            ) {
                best = i;
            }
        }
        const [request] = bootQueue.splice(best, 1);
        bootSlotHolders.add(request.id);
        request.grant();
    }
}

/** Report a visibility change from the wrapper's IntersectionObserver. */
export function reportEditorVisibility(id: string, visible: boolean) {
    const record = records.get(id);
    if (!record || record.visible === visible) {
        return;
    }
    record.visible = visible;
    if (visible) {
        record.lastVisibleOrder = ++visibleOrderCounter;
        scheduleEvaluate(0);
    } else {
        record.invisibleSince = Date.now();
        scheduleEvaluate(record.parkDelayMs);
    }
}

/**
 * Report a mount-state change from the wrapper (which owns the actual
 * mount/unmount and reports the outcome here). Only `"mounted"` editors count
 * against the live budget.
 */
export function notifyEditorState(id: string, state: EditorMountState) {
    const record = records.get(id);
    if (!record || record.state === state) {
        return;
    }
    record.state = state;
    scheduleEvaluate(0);
}

/** Snapshot for tests and manual verification. */
export function getEditorMountStats() {
    let mounted = 0,
        unmounting = 0,
        unmounted = 0;
    for (const record of records.values()) {
        if (record.state === "mounted") {
            mounted++;
        } else if (record.state === "unmounting") {
            unmounting++;
        } else {
            unmounted++;
        }
    }
    return {
        registered: records.size,
        mounted,
        unmounting,
        unmounted,
        booting: bootSlotHolders.size,
        bootQueue: bootQueue.length,
    };
}

/** Test-only: forget every registration and reset module state. */
export function __resetEditorMountManagerForTests() {
    records.clear();
    visibleOrderCounter = 0;
    effectiveMaxLive = null;
    if (evaluateTimerId !== null) {
        clearTimeout(evaluateTimerId);
        evaluateTimerId = null;
    }
    evaluateTimerAt = Infinity;
    effectiveMaxBoots = null;
    bootSlotHolders.clear();
    bootQueue.length = 0;
    bootRequestCounter = 0;
}

/**
 * Schedule an `evaluate()` after `delayMs`, coalescing with any
 * already-scheduled evaluation (the earlier of the two wins).
 */
function scheduleEvaluate(delayMs: number) {
    const at = Date.now() + delayMs;
    if (evaluateTimerId !== null) {
        if (at >= evaluateTimerAt) {
            return;
        }
        clearTimeout(evaluateTimerId);
    }
    evaluateTimerAt = at;
    evaluateTimerId = setTimeout(() => {
        evaluateTimerId = null;
        evaluateTimerAt = Infinity;
        evaluate();
    }, delayMs);
}

/**
 * Enforce the budget: if more editors are mounted than `maxLive`, ask the
 * least-recently-visible eligible off-screen editors to unload. If some
 * over-budget editors are only ineligible because their off-screen debounce
 * hasn't elapsed, re-evaluate when it does. Editors mid-unload
 * (`"unmounting"`) are already committed to freeing their slot, so they do not
 * count here (mirrors the viewer manager not counting `"parking"`).
 */
function evaluate() {
    if (effectiveMaxLive === null) {
        return;
    }
    const now = Date.now();

    let mounted = 0;
    for (const record of records.values()) {
        if (record.state === "mounted") {
            mounted++;
        }
    }
    let excess = mounted - effectiveMaxLive;
    if (excess <= 0) {
        return;
    }

    const candidates: EditorRecord[] = [];
    let nextDebounceExpiry = Infinity;
    for (const record of records.values()) {
        if (record.state !== "mounted" || record.visible) {
            continue;
        }
        const eligibleAt = record.invisibleSince + record.parkDelayMs;
        if (eligibleAt > now) {
            nextDebounceExpiry = Math.min(nextDebounceExpiry, eligibleAt);
            continue;
        }
        candidates.push(record);
    }

    candidates.sort((a, b) => a.lastVisibleOrder - b.lastVisibleOrder);

    for (const record of candidates) {
        if (excess <= 0) {
            break;
        }
        // Mark optimistically so a single pass doesn't evict the same editor
        // twice; the wrapper confirms via `notifyEditorState("unmounted")`.
        record.state = "unmounting";
        excess--;
        record.requestEvict();
    }

    if (excess > 0 && nextDebounceExpiry < Infinity) {
        scheduleEvaluate(Math.max(0, nextDebounceExpiry - now));
    }
}
