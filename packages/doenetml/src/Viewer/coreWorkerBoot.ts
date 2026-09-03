import type { Remote } from "comlink";
import type { CoreWorker } from "@doenet/doenetml-worker";

// --- Core-worker boot resilience (Doenet/DoenetApps#2957) -----------------
//
// Helpers used by `DocViewer.startCore` to bring up the core worker robustly.
// Bringing up the core worker has two very different phases:
//
//   1. Handshake — (re)create the worker and run the cheap, roughly
//      document-size-independent init round-trips (set source/flags,
//      initialize the JS core). Empirically a few hundred ms regardless of
//      document size. A Doenet/DoenetApps#2957 stall lives HERE: a worker that
//      never loads or wedges leaves these awaits unsettled, and because the
//      worker serializes everything through one internal promise queue, a
//      stall there wedges the queue so even the worker's own `terminate()`
//      never returns.
//
//   2. generateDast — the actual evaluation. Legitimately slow and scales with
//      document size (seconds to minutes on complex documents).
//
// So `DocViewer.startCore` time-boxes ONLY the handshake (force-killing a
// wedged worker natively and retrying), then lets generateDast run to
// completion however long it takes. Time-boxing generateDast would be wrong:
// it can't tell a slow-but-working core from a hung one, and would make large
// documents unloadable. Once the handshake completes, the worker has proven it
// is alive, so a long evaluation is real work — not a hang.

export const DEFAULT_CORE_BOOT_MAX_ATTEMPTS = 3;
// The BASE budget: what one handshake gets on an uncontended page.
// `handshakeWatchdogMsFor` widens it from here as pressure rises (#1711).
//
// Sized to clear any *healthy* handshake with wide margin while still
// recovering from a genuine hang reasonably quickly. The handshake is
// fixed-size work (parse the worker bundle, compile the WASM, init the JS
// core) — not something that scales with document size — and on developer
// hardware it stays bounded under CPU pressure: measured ~0.4s idle and only
// ~2s with 24 workers booting at once. On the low-end machine in #1707 that
// bound did not hold, which is why the base is scaled rather than fixed.
//
// Caveat: when a document uses `fetchExternalDoenetML`, the (network)
// expansion of external references runs inside this phase too, so a deployment
// that relies on slow/large external references may want to raise this via
// `doenetGlobalConfig.coreHandshakeWatchdogMs`. Erring high is deliberate: a
// watchdog *shorter* than a healthy handshake makes the document unloadable on
// exactly the slow/contended runners this guard exists for, whereas erring
// long only delays recovery from a (rare) true hang.
export const DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS = 15_000;

/**
 * Ceiling for the contention-scaled watchdog (#1711). Past this, a handshake
 * has been unresponsive long enough that contention stops being a credible
 * explanation, and continuing to wait only delays recovery from a true hang.
 */
export const MAX_CORE_HANDSHAKE_WATCHDOG_MS = 90_000;

/**
 * Watchdog budget for one handshake attempt, widened by how many handshakes
 * are running across the page relative to what the machine can actually work
 * on at once.
 *
 * The fixed 15 s was measured on developer hardware, where the handshake
 * "stays bounded under CPU pressure". On the 1.1 GHz dual-core machine in
 * #1707 it is not bounded: a page of activities all booting at once pushes a
 * perfectly healthy handshake past 15 s, and the watchdog then does the thing
 * this file's own comment warns against — making the document unloadable on
 * exactly the contended runners the guard exists for.
 *
 * So the budget scales with pressure (handshakes per core) rather than with a
 * guess about machine speed, which nothing exposes directly. One handshake per
 * core is the neutral case and keeps today's 15 s; four handshakes on two
 * cores doubles it. Erring long stays the deliberate bias: too long only
 * delays recovery from a rare true hang, while too short makes documents
 * permanently unloadable on slow machines.
 */
export function handshakeWatchdogMsFor({
    concurrentHandshakes,
    hardwareConcurrency,
    baseMs = DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS,
}: {
    concurrentHandshakes: number;
    hardwareConcurrency: number;
    baseMs?: number;
}): number {
    const cores = Math.max(1, hardwareConcurrency || 1);
    const inFlight = Math.max(1, concurrentHandshakes);
    const pressure = Math.max(1, Math.ceil(inFlight / cores));
    return Math.min(baseMs * pressure, MAX_CORE_HANDSHAKE_WATCHDOG_MS);
}

/**
 * Marks the rejection `withTimeout` raises when its own deadline passes, so a
 * caller can tell "the task never settled" from "the task failed". They call
 * for different responses: a task that never settled may have left a wedged
 * worker behind and may be a casualty of CPU pressure, whereas an outright
 * rejection is a definite, attributable error (see `isHandshakeTimeout`).
 */
const TIMEOUT_ERROR_FLAG = "__doenetWithTimeoutExpired";

/**
 * Did this handshake failure come from the watchdog expiring, rather than from
 * the handshake itself rejecting?
 *
 * Only a timeout is evidence of a stalled worker, and only a timeout can be
 * blamed on contention: a rejection (a worker script that 404s, a core that
 * throws while initializing) reproduces on an idle page too, so attributing it
 * to a busy page would both mislead the reader and suppress a wedge suspicion
 * that a definite error never earned.
 */
export function isHandshakeTimeout(err: unknown): boolean {
    return (
        typeof err === "object" &&
        err !== null &&
        (err as Record<string, unknown>)[TIMEOUT_ERROR_FLAG] === true
    );
}

/**
 * Is the page contended enough that a handshake timeout is better explained by
 * CPU pressure than by a wedged worker (#1711)?
 *
 * The distinction matters beyond this document. A timeout normally tears the
 * worker down with `suspectWedge`, which in shared-core mode quarantines the
 * whole host worker: its live cores run on, but it takes no new ones, so the
 * killed-and-retried core — and every core boot after it — lands on a
 * replacement host whose multi-MB worker must spawn and compile under the
 * very contention that produced the timeout. `docUtils` already concedes the
 * suspicion "may be a false positive (CPU contention)"; this is what lets the
 * caller act on that rather than only comment on it.
 *
 * Deliberately conservative: on an idle page nothing changes, and a genuine
 * hang is still caught and quarantined as promptly as before.
 */
export function timeoutLooksLikeContention({
    concurrentHandshakes,
    hardwareConcurrency,
}: {
    concurrentHandshakes: number;
    hardwareConcurrency: number;
}): boolean {
    const cores = Math.max(1, hardwareConcurrency || 1);
    return concurrentHandshakes > cores;
}

export const CORE_BOOT_RETRY_DELAY_MS = 250;
export const MAX_CORE_BOOT_RETRY_DELAY_MS = 4_000;
const GRACEFUL_TERMINATE_TIMEOUT_MS = 2_000;

/**
 * Delay before handshake attempt `attempt` (0-based) retries.
 *
 * The flat 250 ms re-piled a fresh worker — and its multi-MB parse — onto a
 * machine that had just failed to finish one, which is positive feedback
 * exactly when it can least be afforded. Backing off exponentially gives the
 * contention that caused the timeout a chance to drain first. The jitter (a
 * [1, 2) multiplier) keeps a page full of activities that all timed out
 * together from retrying in lockstep. The exponential value is capped at
 * half of `MAX_CORE_BOOT_RETRY_DELAY_MS` before the jitter applies, so the
 * delay genuinely stays under the max while capped retries keep the jitter's
 * full spread.
 */
export function retryDelayMs(attempt: number): number {
    const backoff = CORE_BOOT_RETRY_DELAY_MS * 2 ** attempt;
    return (
        Math.min(backoff, MAX_CORE_BOOT_RETRY_DELAY_MS / 2) *
        (1 + Math.random())
    );
}

// Shown in the viewer when the core worker can't be started after retries,
// instead of leaving the pane blank (Doenet/DoenetApps#2957). One canonical
// string so the message — which a test also matches on — stays consistent
// across the several failure paths in DocViewer.startCore. It is the English
// fallback for the `core-start-failed` message; `DocViewer` translates it
// before showing it.
export const CORE_START_FAILED_MESSAGE =
    "This document could not be started. Please reload the page.";

/**
 * English fallback for `core-start-failed-busy` — the variant shown when the
 * failure is attributable to several documents starting at once (#1712).
 */
export const CORE_START_FAILED_BUSY_MESSAGE =
    "This document could not be started. Several documents were starting " +
    "at once, which can take longer on a slower device. Reloading the page " +
    "may help once the other documents have finished.";

/**
 * English fallback for `core-start-failed-retry` — what the first failure
 * says, beside the button that starts the document over (#1712). It drops the
 * advice to reload that {@link CORE_START_FAILED_MESSAGE} carries: reloading
 * restarts every other document on the page, which on a busy page is what
 * produced the failure, and the button costs a core rather than a bundle.
 */
export const CORE_START_FAILED_RETRY_MESSAGE =
    "This document could not be started.";

/**
 * English fallback for `core-start-failed-busy-retry` — the contended variant
 * of {@link CORE_START_FAILED_RETRY_MESSAGE}, naming the contention for the
 * same reason {@link CORE_START_FAILED_BUSY_MESSAGE} does.
 */
export const CORE_START_FAILED_BUSY_RETRY_MESSAGE =
    "This document could not be started. Several documents were starting " +
    "at once, which can take longer on a slower device.";

/** English fallback for `core-start-retry` — the retry button's label. */
export const CORE_START_RETRY_MESSAGE = "Try again";

/**
 * English fallback for `saved-state-unavailable` — the lead-in of the notice
 * shown beside a working document whose saved work the host could not
 * produce (#1741). The host's own wording follows it, so this says only what
 * was lost; grouped with the messages above because `DocViewer` renders all
 * of them and translates each before showing it.
 */
export const SAVED_STATE_UNAVAILABLE_MESSAGE =
    "Your saved work could not be loaded.";

/**
 * Resolve/reject with `task()`, but reject with a timeout error if it does
 * not settle within `ms`. The underlying promise is left to settle on its
 * own — we attach a (post-timeout no-op) handler so a late rejection is never
 * reported as unhandled. Callers that time out are responsible for tearing
 * down whatever the task was waiting on.
 *
 * The timeout rejection is tagged so callers can recognize it with
 * `isHandshakeTimeout` instead of matching on the message text.
 *
 * `widenedMs` is for a budget that can only be known once the clock is already
 * running: the census reading a handshake's seat brings back arrives after the
 * handshake it describes has started (#1718). Resolving it to more than `ms`
 * moves the deadline out to it, measured from the same start; a smaller value
 * (or a rejection) leaves the original deadline alone. Widening only ever
 * grants more time, so a task can never be cut short by an answer that arrives
 * late.
 *
 * `restartAt` is for a task that spends its first stretch waiting its turn
 * (#1533): a boot restarted mid-handshake queues behind the initialization
 * already in flight on its worker, and that wait is not the work the budget
 * was sized for. When it resolves, the budget in force is counted from that
 * moment. The wait itself stays bounded — until the turn comes, the deadline
 * is the one the task started with — so a task whose turn never comes still
 * times out.
 */
export function withTimeout<T>(
    task: () => Promise<T>,
    ms: number,
    label: string,
    {
        widenedMs,
        restartAt,
    }: {
        widenedMs?: Promise<number> | null;
        restartAt?: Promise<void> | null;
    } = {},
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let settled = false;
        // When the budget in force started counting: at the call, until
        // `restartAt` moves it.
        let startedAt = Date.now();
        // The budget currently in force — reported in the timeout message, so
        // a reader sees the deadline that actually expired rather than the one
        // the attempt started with.
        let budgetMs = ms;
        function expire() {
            if (!settled) {
                settled = true;
                const err = new Error(`${label} timed out after ${budgetMs}ms`);
                (err as unknown as Record<string, unknown>)[
                    TIMEOUT_ERROR_FLAG
                ] = true;
                reject(err);
            }
        }
        let timer = setTimeout(expire, ms);
        widenedMs
            ?.then((wider) => {
                if (settled || !(wider > budgetMs)) {
                    return;
                }
                budgetMs = wider;
                clearTimeout(timer);
                // Measured from the start of the clock in force, not from
                // now: the wider budget is what this attempt should have had
                // all along, and restarting the clock would hand it the time
                // already spent twice over.
                timer = setTimeout(
                    expire,
                    Math.max(0, startedAt + wider - Date.now()),
                );
            })
            .catch(() => {
                // A budget that never arrives just leaves the deadline as it
                // was; the handler only satisfies "no fire-and-forget
                // promises".
            });
        restartAt
            ?.then(() => {
                if (settled) {
                    return;
                }
                // The budget in force, counted from now. The wait is over,
                // and the deadline was bounding it until this moment; a
                // widening that lands later measures from here.
                startedAt = Date.now();
                clearTimeout(timer);
                timer = setTimeout(expire, budgetMs);
            })
            .catch(() => {
                // A turn that never comes leaves the deadline as it was; the
                // handler only satisfies "no fire-and-forget promises".
            });
        task().then(
            (value) => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve(value);
                }
            },
            (err) => {
                if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    reject(err);
                }
            },
        );
    });
}

/**
 * Tear down a core worker. When `graceful`, first give the Comlink
 * `terminate()` a bounded chance to run its cleanup (it frees the Rust core
 * and the JS core); regardless, always follow with the handle's `kill`
 * switch — so a wedged core, whose Comlink terminate would itself hang on
 * the stuck queue, is still guaranteed to be released. (`kill` natively
 * terminates a dedicated worker; on a shared host worker it closes the
 * core's port and destroys just that core — see `CoreWorkerHandle`.)
 */
export async function disposeCoreWorker(
    remote: Remote<CoreWorker> | null,
    kill: ((suspectWedge?: boolean) => void) | null,
    {
        graceful,
        suspectWedge: suspectWedgeOverride,
    }: {
        graceful: boolean;
        /**
         * States the suspicion outright instead of inferring it from
         * `graceful`. A handshake teardown passes `false` when the timeout
         * that prompted it is better explained by page-wide CPU contention
         * than by a wedged worker (#1711) — a false suspicion would
         * quarantine a shared host that other, healthy documents are still
         * using. Omit it to keep the inference (`!graceful`).
         */
        suspectWedge?: boolean;
    },
) {
    // A non-graceful teardown means the caller already believes the core is
    // wedged (watchdogged handshake timeout); a graceful terminate that times
    // out is the same signal discovered late. Either way, pass the suspicion
    // to `kill` so a shared host (#1466) can quarantine the worker and route
    // retries to a fresh one.
    let suspectWedge = suspectWedgeOverride ?? !graceful;
    if (graceful && remote) {
        try {
            await withTimeout(
                () => remote.terminate(),
                GRACEFUL_TERMINATE_TIMEOUT_MS,
                "core worker graceful terminate",
            );
        } catch {
            // fall through to the guaranteed kill below
            suspectWedge = true;
        }
    }
    try {
        kill?.(suspectWedge);
    } catch {
        // best-effort; nothing more we can do
    }
}
