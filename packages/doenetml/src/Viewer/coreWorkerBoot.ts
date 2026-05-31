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
//      document size. A #2957 stall lives HERE: a worker that never loads or
//      wedges leaves these awaits unsettled, and because the worker serializes
//      everything through one internal promise queue, a stall there wedges the
//      queue so even the worker's own `terminate()` never returns.
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
// Sized to clear any *healthy* handshake with wide margin while still
// recovering from a genuine hang reasonably quickly. The handshake is
// fixed-size work (parse the worker bundle, compile the WASM, init the JS
// core) — not something that scales with document size — and it stays bounded
// under CPU pressure: measured ~0.4s idle and only ~2s with 24 workers booting
// at once. 15s is therefore many times any realistic healthy handshake.
//
// Caveat: when a document uses `fetchExternalDoenetML`, the (network)
// expansion of external references runs inside this phase too, so a deployment
// that relies on slow/large external references may want to raise this via
// `doenetGlobalConfig.coreHandshakeWatchdogMs`. Erring high is deliberate: a
// watchdog *shorter* than a healthy handshake makes the document unloadable on
// exactly the slow/contended runners this guard exists for, whereas erring
// long only delays recovery from a (rare) true hang.
export const DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS = 15_000;
export const CORE_BOOT_RETRY_DELAY_MS = 250;
const GRACEFUL_TERMINATE_TIMEOUT_MS = 2_000;

// Shown in the viewer when the core worker can't be started after retries,
// instead of leaving the pane blank (#2957). One canonical string so the
// message — which a test also matches on — stays consistent across the several
// failure paths in DocViewer.startCore.
export const CORE_START_FAILED_MESSAGE =
    "The document viewer could not be started. Please reload the page.";

/**
 * Resolve/reject with `task()`, but reject with a timeout error if it does
 * not settle within `ms`. The underlying promise is left to settle on its
 * own — we attach a (post-timeout no-op) handler so a late rejection is never
 * reported as unhandled. Callers that time out are responsible for tearing
 * down whatever the task was waiting on.
 */
export function withTimeout<T>(
    task: () => Promise<T>,
    ms: number,
    label: string,
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                reject(new Error(`${label} timed out after ${ms}ms`));
            }
        }, ms);
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
 * and the JS core); regardless, always follow with a native
 * `worker.terminate()` so a wedged worker — whose Comlink terminate would
 * itself hang on the stuck queue — is still guaranteed to die.
 */
export async function disposeCoreWorker(
    remote: Remote<CoreWorker> | null,
    nativeWorker: Worker | null,
    { graceful }: { graceful: boolean },
) {
    if (graceful && remote) {
        try {
            await withTimeout(
                () => remote.terminate(),
                GRACEFUL_TERMINATE_TIMEOUT_MS,
                "core worker graceful terminate",
            );
        } catch {
            // fall through to the guaranteed native kill below
        }
    }
    try {
        nativeWorker?.terminate();
    } catch {
        // best-effort; nothing more we can do
    }
}
