/**
 * DoenetML activity coordinator for static host pages (#1439, #1441 stream
 * B, and the PreTeXt milestone of #1466).
 *
 * Built as `dist/coordinator.js` — a small dependency-free (no React)
 * script a host page adds alongside its DoenetML activity iframes:
 *
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@doenet/standalone@<version>/coordinator.js"></script>
 * ```
 *
 * The coordinator targets the PreTeXt embedding model: each activity is a
 * real same-origin iframe (e.g. `…-if.html`) whose document loads
 * `@doenet/standalone` and calls `renderDoenetViewerToContainer`. It
 * manages those iframes purely by controlling their `src`, so the child
 * pages need no changes — the standalone bundle they already load detects
 * the coordinator's URL-fragment token (see `coordinated-mode.ts`) and
 * cooperates:
 *
 * - **Lazy boot with a concurrency cap.** Activity iframes are detached
 *   (src cleared) up front and only load when they come near the viewport
 *   AND a boot slot is free (`maxConcurrentBoots`, visible-first), so a
 *   chapter with 30 activities boots ~2 at a time instead of stampeding.
 * - **Park / restore.** At most `maxLiveViewers` activities stay live.
 *   Off-screen ones beyond the budget are parked: the coordinator flushes
 *   their state (`SPLICE.flushState`), warehouses the resulting
 *   `SPLICE.reportScoreAndState`, and detaches the iframe (the element —
 *   and thus the layout — stays). Scrolling back restores the iframe; the
 *   rebooting viewer requests its state back (`SPLICE.getState`) and the
 *   coordinator answers from the warehouse, so typed work survives.
 * - **Shared core workers** (`sharedCoreWorkers: true`): child viewers
 *   route core creation to a coordinator-owned worker pool instead of each
 *   booting a dedicated ~100 MB worker (one protocol with
 *   `@doenet/doenetml-iframe`'s `useSharedCoreWorker`).
 *
 * The script auto-initializes at DOMContentLoaded with options read from
 * its own `data-` attributes; call `window.initializeDoenetCoordinator()`
 * for programmatic control instead (set `data-doenet-manual-init` on the
 * script tag to suppress auto-init).
 */

// The shared core-worker pool implementation is maintained in
// @doenet/doenetml-iframe (which pioneered the protocol in #1466). Import
// it by source path so both consumers bundle one implementation; it is
// self-contained (Comlink only).
import {
    handleCreateSharedCore,
    handleDestroySharedCore,
    destroySharedCoresForViewer,
    getSharedCorePoolStats,
} from "../../doenetml-iframe/src/shared-core-pool";

export type DoenetCoordinatorOptions = {
    /**
     * CSS selector for the activity iframes to manage. Default targets
     * PreTeXt's generated interactive pages plus an explicit opt-in
     * attribute.
     */
    iframeSelector?: string;
    /** Page-wide budget of simultaneously live activities. Default 3. */
    maxLiveViewers?: number;
    /** Page-wide cap on concurrently booting activities. Default 2. */
    maxConcurrentBoots?: number;
    /** How far outside the viewport still counts as visible. Default "1000px". */
    visibleMargin?: string;
    /** Off-screen debounce before an activity may be parked. Default 2000. */
    parkDelayMs?: number;
    /** How long to await the pre-park flush acknowledgement. Default 5000. */
    flushTimeoutMs?: number;
    /** A boot never reporting complete frees its slot after this long. Default 90000. */
    bootWatchdogMs?: number;
    /** Serve child viewers cores from a coordinator-owned shared worker pool. */
    sharedCoreWorkers?: boolean;
};

const DEFAULTS = {
    iframeSelector:
        "iframe[data-doenet-coordinate], iframe[src$='-if.html'], iframe[src*='-if.html?']",
    maxLiveViewers: 3,
    maxConcurrentBoots: 2,
    visibleMargin: "1000px",
    parkDelayMs: 2000,
    flushTimeoutMs: 5000,
    bootWatchdogMs: 90_000,
    sharedCoreWorkers: false,
};

type ActivityState = "detached" | "booting" | "live" | "parking" | "parked";

type ActivityRecord = {
    iframe: HTMLIFrameElement;
    /** The activity URL with the coordinator's fragment token appended. */
    markedSrc: string;
    state: ActivityState;
    visible: boolean;
    lastVisibleOrder: number;
    invisibleSince: number;
    /** Latest SPLICE.reportScoreAndState from this activity (the warehouse). */
    lastReport: any;
    /** message_id of an in-flight pre-park flush. */
    parkFlushId: string | null;
    parkFlushCleanup: (() => void) | null;
    bootWatchdogId: ReturnType<typeof setTimeout> | null;
    /** Shared-core ids created by this activity's current realm. */
    poolViewerId: string;
};

let initialized = false;

export function initializeDoenetCoordinator(
    options: DoenetCoordinatorOptions = {},
) {
    if (initialized) {
        console.warn("Doenet coordinator: already initialized; ignoring.");
        return;
    }
    initialized = true;

    const opts = { ...DEFAULTS, ...options };
    const marker = `doenetCoordinated=v1${opts.sharedCoreWorkers ? "sc" : ""}`;

    const records = new Map<HTMLIFrameElement, ActivityRecord>();
    let visibleOrderCounter = 0;
    let flushIdCounter = 0;
    const bootSlotHolders = new Set<ActivityRecord>();
    const bootQueue: ActivityRecord[] = [];

    /** The record whose (same-origin) iframe posted this message, if any. */
    function recordForEvent(event: MessageEvent): ActivityRecord | undefined {
        for (const record of records.values()) {
            if (
                record.iframe.isConnected &&
                record.iframe.contentWindow === event.source
            ) {
                return record;
            }
        }
        return undefined;
    }

    function markSrc(src: string): string {
        return src + (src.includes("#") ? "&" : "#") + marker;
    }

    // ---- boot slots ----

    function requestBootSlot(record: ActivityRecord) {
        if (bootSlotHolders.has(record) || bootQueue.includes(record)) {
            return;
        }
        bootQueue.push(record);
        pumpBootQueue();
    }

    function cancelBootRequest(record: ActivityRecord) {
        const idx = bootQueue.indexOf(record);
        if (idx !== -1) {
            bootQueue.splice(idx, 1);
        }
    }

    function releaseBootSlot(record: ActivityRecord) {
        if (record.bootWatchdogId !== null) {
            clearTimeout(record.bootWatchdogId);
            record.bootWatchdogId = null;
        }
        if (bootSlotHolders.delete(record)) {
            pumpBootQueue();
        }
    }

    function pumpBootQueue() {
        while (
            bootQueue.length > 0 &&
            bootSlotHolders.size < opts.maxConcurrentBoots
        ) {
            // Visible-first, then queue order.
            let best = 0;
            for (let i = 1; i < bootQueue.length; i++) {
                if (bootQueue[i].visible && !bootQueue[best].visible) {
                    best = i;
                }
            }
            const [record] = bootQueue.splice(best, 1);
            if (!record.visible || record.state !== "parked") {
                continue;
            }
            bootSlotHolders.add(record);
            boot(record);
        }
    }

    function boot(record: ActivityRecord) {
        record.state = "booting";
        navigateToMarkedSrc(record);
        // A boot that never reports complete (wedged worker, ancient bundle
        // that predates the coordinated-mode token) must not starve the
        // queue; the boot itself continues, only the slot is freed.
        record.bootWatchdogId = setTimeout(() => {
            record.bootWatchdogId = null;
            if (record.state === "booting") {
                record.state = "live";
            }
            releaseBootSlot(record);
            evaluateBudget();
        }, opts.bootWatchdogMs);
    }

    /**
     * Navigate the iframe to its marked URL via a guaranteed FULL load.
     * The marked URL differs from the original only by its fragment, and
     * the token must be present when the standalone bundle EVALUATES — but
     * if the original document managed to commit before (or while) we
     * detached it, assigning the marked URL directly would be treated as a
     * same-document fragment navigation and nothing would re-evaluate.
     * So: only assign the marked URL once an `about:blank` document has
     * actually committed; otherwise (re)detach and wait for that commit.
     */
    function navigateToMarkedSrc(record: ActivityRecord) {
        const iframe = record.iframe;
        let committedHref: string | null = null;
        try {
            // Same-origin by construction (activities are filtered at
            // discovery), so the child location is readable.
            committedHref = iframe.contentWindow?.location.href ?? null;
        } catch {
            committedHref = null;
        }
        if (committedHref === "about:blank") {
            iframe.src = record.markedSrc;
            return;
        }
        const onDetached = () => {
            iframe.removeEventListener("load", onDetached);
            if (record.state === "booting") {
                iframe.src = record.markedSrc;
            }
        };
        iframe.addEventListener("load", onDetached);
        iframe.src = "about:blank";
    }

    // ---- park / restore ----

    function beginPark(record: ActivityRecord) {
        if (record.state !== "live" || !record.iframe.contentWindow) {
            return;
        }
        record.state = "parking";
        const flushId = `__doenetCoordinatorFlush-${++flushIdCounter}`;
        record.parkFlushId = flushId;
        const post = () => {
            record.iframe.contentWindow?.postMessage(
                { subject: "SPLICE.flushState", message_id: flushId },
                "*",
            );
        };
        const retryTimer = setInterval(post, 500);
        const timeoutTimer = setTimeout(() => {
            // No acknowledgement. A persistence path exists (the token set
            // allowSaveState), so what the warehouse holds is what a live
            // wedged realm could offer anyway — park regardless.
            finishPark(record);
        }, opts.flushTimeoutMs);
        record.parkFlushCleanup = () => {
            clearInterval(retryTimer);
            clearTimeout(timeoutTimer);
            record.parkFlushCleanup = null;
        };
        post();
    }

    function finishPark(record: ActivityRecord) {
        record.parkFlushCleanup?.();
        record.parkFlushId = null;
        if (record.state !== "parking") {
            return;
        }
        if (record.visible) {
            // Scrolled back mid-flush; nothing was torn down.
            record.state = "live";
            return;
        }
        // Detach the realm. The iframe element (and the page layout) stays;
        // the browser discards the document, its worker(s), and its shared
        // cores — release the latter from the pool.
        destroySharedCoresForViewer(record.poolViewerId);
        releaseBootSlot(record);
        record.iframe.src = "about:blank";
        record.state = "parked";
    }

    function unpark(record: ActivityRecord) {
        if (record.state !== "parked") {
            return;
        }
        requestBootSlot(record);
    }

    // ---- budget ----

    let evaluateTimerId: ReturnType<typeof setTimeout> | null = null;
    function scheduleEvaluate(delayMs: number) {
        if (evaluateTimerId !== null) {
            return;
        }
        evaluateTimerId = setTimeout(() => {
            evaluateTimerId = null;
            evaluateBudget();
        }, delayMs);
    }

    function evaluateBudget() {
        const now = Date.now();
        let active = 0;
        for (const record of records.values()) {
            if (record.state !== "parked" && record.state !== "detached") {
                active++;
            }
        }
        let excess = active - opts.maxLiveViewers;
        if (excess <= 0) {
            return;
        }
        const candidates: ActivityRecord[] = [];
        let nextExpiry = Infinity;
        for (const record of records.values()) {
            if (record.state !== "live" || record.visible) {
                continue;
            }
            const eligibleAt = record.invisibleSince + opts.parkDelayMs;
            if (eligibleAt > now) {
                nextExpiry = Math.min(nextExpiry, eligibleAt);
                continue;
            }
            candidates.push(record);
        }
        candidates.sort((a, b) => a.lastVisibleOrder - b.lastVisibleOrder);
        for (const record of candidates) {
            if (excess <= 0) {
                break;
            }
            excess--;
            beginPark(record);
        }
        if (excess > 0 && nextExpiry < Infinity) {
            scheduleEvaluate(Math.max(0, nextExpiry - now));
        }
    }

    // ---- messages from activities ----

    window.addEventListener("message", (event: MessageEvent) => {
        const data = event.data;
        if (!data || typeof data !== "object") {
            return;
        }

        // Shared core-worker pool protocol (same shapes as
        // @doenet/doenetml-iframe's useSharedCoreWorker).
        if (data.origin === "doenetCoordinatedChild" && data.data) {
            const record = recordForEvent(event);
            if (!record) {
                return;
            }
            const inner = data.data;
            if (inner.type === "bootComplete") {
                if (record.state === "booting") {
                    record.state = "live";
                }
                releaseBootSlot(record);
                evaluateBudget();
                return;
            }
            if (
                opts.sharedCoreWorkers &&
                inner.type === "createSharedCore" &&
                event.ports[0]
            ) {
                handleCreateSharedCore({
                    viewerId: record.poolViewerId,
                    coreId: String(inner.coreId),
                    standaloneUrl: String(inner.standaloneUrl),
                    port: event.ports[0],
                });
                return;
            }
            if (opts.sharedCoreWorkers && inner.type === "destroySharedCore") {
                handleDestroySharedCore({
                    coreId: String(inner.coreId),
                    suspectWedge: Boolean(inner.suspectWedge),
                });
                return;
            }
            return;
        }

        // SPLICE traffic from the child viewers (routed here by the
        // coordinated-mode `messageParent` flag).
        if (typeof data.subject !== "string") {
            return;
        }
        const record = recordForEvent(event);
        if (!record) {
            return;
        }
        if (data.subject === "SPLICE.reportScoreAndState") {
            // The warehouse: always keep the latest state.
            record.lastReport = data;
            return;
        }
        if (
            data.subject === "SPLICE.flushState.response" &&
            data.message_id === record.parkFlushId
        ) {
            finishPark(record);
            return;
        }
        if (data.subject === "SPLICE.getState" && record.lastReport?.state) {
            // A restored activity asking for its parked state back.
            record.iframe.contentWindow?.postMessage(
                {
                    subject: "SPLICE.getState.response",
                    message_id: data.message_id,
                    state: record.lastReport.state,
                },
                "*",
            );
            return;
        }
    });

    // ---- discovery + visibility ----

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const record = records.get(entry.target as HTMLIFrameElement);
                if (!record || record.visible === entry.isIntersecting) {
                    continue;
                }
                record.visible = entry.isIntersecting;
                if (entry.isIntersecting) {
                    record.lastVisibleOrder = ++visibleOrderCounter;
                    if (record.state === "parked") {
                        unpark(record);
                    }
                    scheduleEvaluate(0);
                } else {
                    record.invisibleSince = Date.now();
                    if (record.state === "parked") {
                        cancelBootRequest(record);
                    }
                    scheduleEvaluate(opts.parkDelayMs);
                }
            }
        },
        { rootMargin: opts.visibleMargin },
    );

    let poolViewerCounter = 0;
    for (const element of document.querySelectorAll(opts.iframeSelector)) {
        if (!(element instanceof HTMLIFrameElement)) {
            continue;
        }
        const originalSrc = element.src;
        if (!originalSrc) {
            continue;
        }
        // Same-origin activities only (the child bundle must be able to
        // post to us, and we manage its URL).
        try {
            if (new URL(originalSrc).origin !== window.location.origin) {
                continue;
            }
        } catch {
            continue;
        }
        const record: ActivityRecord = {
            iframe: element,
            markedSrc: markSrc(originalSrc),
            state: "parked",
            visible: false,
            lastVisibleOrder: 0,
            invisibleSince: Date.now(),
            lastReport: null,
            parkFlushId: null,
            parkFlushCleanup: null,
            bootWatchdogId: null,
            poolViewerId: `coordinator-${++poolViewerCounter}`,
        };
        records.set(element, record);
        // Detach immediately: activities load only via boot slots. (An
        // iframe that already started loading is cancelled; it cannot have
        // user state yet.)
        element.src = "about:blank";
        observer.observe(element);
    }

    // Diagnostics for tests and host dashboards.
    (window as any).doenetCoordinatorStats = () => {
        const byState: Record<string, number> = {};
        for (const record of records.values()) {
            byState[record.state] = (byState[record.state] ?? 0) + 1;
        }
        return {
            activities: records.size,
            byState,
            booting: bootSlotHolders.size,
            bootQueue: bootQueue.length,
            sharedCorePool: getSharedCorePoolStats(),
        };
    };

    console.log(
        `Doenet coordinator: managing ${records.size} activit${records.size === 1 ? "y" : "ies"} (maxLiveViewers=${opts.maxLiveViewers}, maxConcurrentBoots=${opts.maxConcurrentBoots}, sharedCoreWorkers=${opts.sharedCoreWorkers})`,
    );
}

// Expose for manual initialization and auto-init with options read from the
// script tag's data attributes (kebab-case → camelCase handled by dataset).
(window as any).initializeDoenetCoordinator = initializeDoenetCoordinator;

const scriptElement = document.currentScript as HTMLScriptElement | null;
if (!scriptElement?.dataset.doenetManualInit) {
    const datasetOptions: DoenetCoordinatorOptions = {};
    const dataset = scriptElement?.dataset ?? {};
    if (dataset.iframeSelector) {
        datasetOptions.iframeSelector = dataset.iframeSelector;
    }
    if (dataset.maxLiveViewers) {
        datasetOptions.maxLiveViewers = parseInt(dataset.maxLiveViewers, 10);
    }
    if (dataset.maxConcurrentBoots) {
        datasetOptions.maxConcurrentBoots = parseInt(
            dataset.maxConcurrentBoots,
            10,
        );
    }
    if (dataset.visibleMargin) {
        datasetOptions.visibleMargin = dataset.visibleMargin;
    }
    if (dataset.parkDelayMs) {
        datasetOptions.parkDelayMs = parseInt(dataset.parkDelayMs, 10);
    }
    if (dataset.flushTimeoutMs) {
        datasetOptions.flushTimeoutMs = parseInt(dataset.flushTimeoutMs, 10);
    }
    if (dataset.sharedCoreWorkers) {
        datasetOptions.sharedCoreWorkers =
            dataset.sharedCoreWorkers !== "false";
    }
    const start = () => initializeDoenetCoordinator(datasetOptions);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
}
