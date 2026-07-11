/**
 * Page-wide lifecycle manager for windowed `<DoenetViewer>` mounting
 * (#1441, stream B).
 *
 * Viewers that opt in via the `mountPolicy` prop register here. The manager
 * enforces a page-wide budget of live viewers: when more than
 * `maxLiveViewers` are live at once, the least-recently-visible off-screen
 * viewers are asked to park (flush their state and replace their iframe with
 * a placeholder), so idle memory tracks what the user can see rather than
 * how many documents the page embeds.
 *
 * This module is pure policy: *when* to park. The mechanics of parking
 * (flushing state, swapping the iframe for a placeholder, restoring) live in
 * the `DoenetViewer` wrapper, which registers callbacks here. Module-level
 * state is intentional — the budget is shared by every windowed viewer on
 * the page (same pattern as `shared-core-pool.ts`).
 *
 * Rules:
 * - A currently-visible viewer is never parked (the budget is soft: if more
 *   than `maxLiveViewers` are visible at once, all of them stay live).
 * - A viewer only becomes eligible to park after it has been off-screen for
 *   its `parkDelayMs` (debounce against scroll flicker).
 * - Viewers whose `canPark` returns false (no persistence path — parking
 *   would lose student work) are never parked.
 * - Eviction order is least-recently-visible first.
 */

export type MountPolicy = {
    /** The only mode currently defined. */
    mode: "windowed";
    /**
     * Page-wide budget of simultaneously live (iframe-mounted) viewers.
     * When viewers on the same page specify different values, the smallest
     * wins. Default 3.
     */
    maxLiveViewers?: number;
    /**
     * `rootMargin` for the visibility observer — how far outside the
     * viewport a viewer still counts as "visible". Default "1000px".
     */
    visibleMargin?: string;
    /**
     * How long to wait for the viewer to acknowledge the pre-park state
     * flush before parking anyway. Default 5000.
     */
    flushTimeoutMs?: number;
    /**
     * How long a viewer must be continuously off-screen before it may be
     * parked. Default 2000.
     */
    parkDelayMs?: number;
    /**
     * Page-wide cap on how many windowed viewers may be *booting* their
     * iframe realm at once (each boot parses the multi-MB standalone bundle
     * and starts a core worker — the initialization stampede #1439
     * targets). Additional viewers wait for a slot, visible-first. As with
     * `maxLiveViewers`, the smallest value across viewers wins. Default 2.
     */
    maxConcurrentBoots?: number;
};

export const DEFAULT_MAX_LIVE_VIEWERS = 3;
export const DEFAULT_VISIBLE_MARGIN = "1000px";
export const DEFAULT_FLUSH_TIMEOUT_MS = 5000;
export const DEFAULT_PARK_DELAY_MS = 2000;
export const DEFAULT_MAX_CONCURRENT_BOOTS = 2;
/**
 * A boot that never reports initialized (wedged worker, huge document on a
 * slow machine) must not starve the queue forever; its slot is reclaimed
 * after this long. The boot itself continues — only the slot is freed.
 */
export const BOOT_SLOT_WATCHDOG_MS = 90_000;

export type ViewerLifecycleState = "live" | "parking" | "parked";

type ViewerRecord = {
    id: string;
    state: ViewerLifecycleState;
    visible: boolean;
    /** Monotonic counter value from when this viewer was last visible. */
    lastVisibleOrder: number;
    /** Timestamp when this viewer last became invisible. */
    invisibleSince: number;
    parkDelayMs: number;
    canPark: () => boolean;
    requestPark: () => void;
};

const records = new Map<string, ViewerRecord>();
let visibleOrderCounter = 0;
let effectiveMaxLive: number | null = null;
let warnedMixedBudgets = false;

let evaluateTimerId: ReturnType<typeof setTimeout> | null = null;
let evaluateTimerAt = Infinity;

// ---- Boot-slot semaphore (#1439) ----
// Caps how many windowed viewers boot their iframe realm simultaneously.
let effectiveMaxBoots: number | null = null;
const bootSlotHolders = new Set<string>();
type BootRequest = { id: string; requestOrder: number; grant: () => void };
let bootRequestCounter = 0;
const bootQueue: BootRequest[] = [];

/**
 * Register a windowed viewer. Returns an unregister function for the
 * component's unmount cleanup.
 */
export function registerWindowedViewer({
    id,
    maxLiveViewers,
    maxConcurrentBoots,
    parkDelayMs,
    canPark,
    requestPark,
}: {
    id: string;
    maxLiveViewers: number;
    maxConcurrentBoots: number;
    parkDelayMs: number;
    canPark: () => boolean;
    requestPark: () => void;
}): () => void {
    effectiveMaxBoots =
        effectiveMaxBoots === null
            ? maxConcurrentBoots
            : Math.min(effectiveMaxBoots, maxConcurrentBoots);
    if (
        effectiveMaxLive !== null &&
        effectiveMaxLive !== maxLiveViewers &&
        !warnedMixedBudgets
    ) {
        warnedMixedBudgets = true;
        console.warn(
            `DoenetViewer mountPolicy: viewers on this page specify different maxLiveViewers (${effectiveMaxLive} and ${maxLiveViewers}); using the smaller value.`,
        );
    }
    effectiveMaxLive =
        effectiveMaxLive === null
            ? maxLiveViewers
            : Math.min(effectiveMaxLive, maxLiveViewers);

    records.set(id, {
        id,
        state: "live",
        visible: false,
        lastVisibleOrder: 0,
        invisibleSince: Date.now(),
        parkDelayMs,
        canPark,
        requestPark,
    });
    scheduleEvaluate(parkDelayMs);

    return () => {
        records.delete(id);
        cancelBootRequest(id);
        releaseBootSlot(id);
        scheduleEvaluate(0);
    };
}

/**
 * Request a boot slot; `grant` is called (synchronously when a slot is
 * free) once this viewer may create its iframe. Visible viewers are served
 * before off-screen ones, then request order. A duplicate request for an id
 * already queued or already holding a slot is ignored.
 */
export function requestBootSlot(id: string, grant: () => void) {
    if (bootSlotHolders.has(id) || bootQueue.some((r) => r.id === id)) {
        return;
    }
    bootQueue.push({ id, requestOrder: ++bootRequestCounter, grant });
    pumpBootQueue();
}

/** Withdraw a queued boot request (e.g. the viewer scrolled away again). */
export function cancelBootRequest(id: string) {
    const idx = bootQueue.findIndex((r) => r.id === id);
    if (idx !== -1) {
        bootQueue.splice(idx, 1);
    }
}

/**
 * Release a held boot slot (the boot finished, failed, was watchdogged, or
 * the viewer parked/unmounted). Idempotent.
 */
export function releaseBootSlot(id: string) {
    if (bootSlotHolders.delete(id)) {
        pumpBootQueue();
    }
}

function pumpBootQueue() {
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

/**
 * Report a visibility change from the component's IntersectionObserver.
 */
export function setViewerVisibility(id: string, visible: boolean) {
    const record = records.get(id);
    if (!record || record.visible === visible) {
        return;
    }
    record.visible = visible;
    if (visible) {
        record.lastVisibleOrder = ++visibleOrderCounter;
        // Another viewer may need to park to make room once this one is
        // live again (the component unparks itself on visibility).
        scheduleEvaluate(0);
    } else {
        record.invisibleSince = Date.now();
        scheduleEvaluate(record.parkDelayMs);
    }
}

/**
 * Report a lifecycle-state change from the component (the component owns the
 * actual park/unpark mechanics and reports the outcome here).
 */
export function notifyViewerState(id: string, state: ViewerLifecycleState) {
    const record = records.get(id);
    if (!record || record.state === state) {
        return;
    }
    record.state = state;
    scheduleEvaluate(0);
}

/** Snapshot for tests and diagnostics. */
export function getViewerLifecycleStats() {
    let live = 0,
        parking = 0,
        parked = 0;
    for (const record of records.values()) {
        if (record.state === "live") {
            live++;
        } else if (record.state === "parking") {
            parking++;
        } else {
            parked++;
        }
    }
    return {
        registered: records.size,
        live,
        parking,
        parked,
        booting: bootSlotHolders.size,
        bootQueue: bootQueue.length,
    };
}

/** Test-only: forget every registration and reset module state. */
export function __resetViewerLifecycleManagerForTests() {
    records.clear();
    visibleOrderCounter = 0;
    effectiveMaxLive = null;
    warnedMixedBudgets = false;
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
 * Enforce the budget: if more viewers are live than `maxLiveViewers`, ask the
 * least-recently-visible eligible off-screen viewers to park. If some
 * over-budget viewers are only ineligible because their park-delay debounce
 * hasn't elapsed, re-evaluate when it does.
 *
 * Only genuinely `live` viewers count against the budget here. Viewers
 * mid-park (`parking`) are already committed to freeing their slot, so
 * counting them would over-park: a re-evaluation while one park is in flight
 * (e.g. another park completing, which schedules an evaluate) would shed an
 * additional live viewer to make room the in-flight park is already making,
 * driving the page below `maxLiveViewers`. (A park that aborts flips the
 * viewer back to `live`/visible and re-schedules an evaluate, so nothing is
 * under-counted.)
 */
function evaluate() {
    if (effectiveMaxLive === null) {
        return;
    }
    const now = Date.now();

    let live = 0;
    for (const record of records.values()) {
        if (record.state === "live") {
            live++;
        }
    }
    let excess = live - effectiveMaxLive;
    if (excess <= 0) {
        return;
    }

    const candidates: ViewerRecord[] = [];
    let nextDebounceExpiry = Infinity;
    for (const record of records.values()) {
        if (record.state !== "live" || record.visible) {
            continue;
        }
        const eligibleAt = record.invisibleSince + record.parkDelayMs;
        if (eligibleAt > now) {
            nextDebounceExpiry = Math.min(nextDebounceExpiry, eligibleAt);
            continue;
        }
        if (!record.canPark()) {
            continue;
        }
        candidates.push(record);
    }

    candidates.sort((a, b) => a.lastVisibleOrder - b.lastVisibleOrder);

    for (const record of candidates) {
        if (excess <= 0) {
            break;
        }
        // Mark optimistically so a single evaluation pass doesn't ask the
        // same viewer twice; the component corrects the state via
        // `notifyViewerState` if the park aborts.
        record.state = "parking";
        excess--;
        record.requestPark();
    }

    if (excess > 0 && nextDebounceExpiry < Infinity) {
        scheduleEvaluate(Math.max(0, nextDebounceExpiry - now));
    }
}
