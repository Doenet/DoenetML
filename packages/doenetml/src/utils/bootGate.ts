/**
 * In-realm boot throttle for pages no host manager gates (#1710).
 *
 * Every embedding of ours that puts many documents on one page caps how many
 * boot at once — `@doenet/standalone`'s parent-page coordinator,
 * `@doenet/doenetml-iframe`'s windowed `mountPolicy`, and the docs site's own
 * `editor-mount-manager`. All of them live on the PARENT page and are opt-in,
 * so a host that has adopted none of them boots every document at once.
 * PreTeXt/Runestone is such a host: a textbook section starts every activity
 * simultaneously, and on a low-end machine the resulting contention pushes
 * healthy handshakes past their watchdog and the activities fail outright
 * (#1707).
 *
 * This gate is the fallback for that case. It needs no host cooperation: the
 * activity realms on a page are same-origin with each other, so the Web Locks
 * API — which is scoped per origin and spans every same-origin realm,
 * including iframes — gives us a page-wide counting semaphore with nothing
 * for the host to install.
 *
 * Web Locks rather than a hand-rolled `BroadcastChannel` protocol for one
 * decisive reason: the browser releases a lock when the realm holding it goes
 * away. A crashed, navigated, or detached activity cannot wedge the queue for
 * its siblings, which is precisely the failure a page of struggling activities
 * would otherwise be prone to.
 *
 * "Page-wide" throughout this file is shorthand: a lock manager is scoped to
 * an ORIGIN, so the cap is really shared with every same-origin realm the
 * browser is running, including other tabs on the same site. That is the right
 * scope for what is being bounded — the CPU those tabs contend for is the same
 * CPU — and the `GATE_WAIT_TIMEOUT_MS` bypass below keeps the wider scope from
 * ever being worse than ungated.
 *
 * Two properties are load-bearing:
 *
 * - **It stands down under a host manager** (`isBootExternallyManaged`).
 *   Nesting this under an existing cap composes multiplicatively and would
 *   serialize a managed page — slowly, and for reasons hard to attribute —
 *   on exactly the slow machines the cap exists to help.
 * - **It fails open.** No Web Locks, a rejected request, or a wait that runs
 *   past `GATE_WAIT_TIMEOUT_MS` all boot immediately. Every failure mode
 *   degrades to today's behavior (ungated); none can leave a document that
 *   never boots.
 *
 * Scope note: this gates the core boot in `DocViewer.startCore` — worker
 * creation and WASM compilation — not the parse of the standalone bundle
 * itself. In the iframe-per-activity embedding each realm parses that bundle
 * before any of our code runs there, so it is not something a gate inside the
 * bundle can defer. The worker is the larger and more contended half, and it
 * is the half we can reach. (The structure-only worker a viewer primes while
 * `render` is false is also outside the gate: it is created from render-phase
 * code, and the hosts that use it schedule their own boots anyway.)
 */

import { doenetGlobalConfig } from "../global-config";
import { isBootExternallyManaged } from "./bootScheduling";
import { reportedCores } from "./handshakeCensus";
import { lockManager, type LockManagerLike } from "./webLocks";

/**
 * Lock names for the semaphore's slots. Namespaced so we cannot collide with
 * a host's own Web Locks usage.
 */
const SLOT_LOCK_PREFIX = "doenet-boot-slot-";

/**
 * Cap on concurrent boots when this gate is in force.
 *
 * Derived from `hardwareConcurrency` so the limit tracks the machine rather
 * than a guess: 2 on the dual-core i3 that motivated #1707 (which reports 4),
 * and comfortably out of the way on a developer machine. The floor of 2 keeps
 * a page from serializing completely where the hint is missing or absurdly
 * low; the ceiling keeps a many-core machine from reintroducing the stampede
 * this exists to prevent.
 */
export function defaultMaxConcurrentBoots(): number {
    const cores = reportedCores();
    if (!cores) {
        return 2;
    }
    return Math.max(2, Math.min(6, Math.floor(cores / 2)));
}

/**
 * How long a boot may wait for a slot before giving up on the gate and
 * proceeding anyway.
 *
 * A boot that waits forever is worse than an ungated one: it is invisible and
 * unrecoverable, whereas the contention it would have avoided merely makes
 * things slow. Sized above a realistic queue of slow boots (the case this
 * gate exists for, where each boot is genuinely taking many seconds) so the
 * bypass is a true backstop rather than a routine occurrence.
 *
 * Exported so the fail-open test can drive the backstop by name rather than
 * by a duplicated literal.
 */
export const GATE_WAIT_TIMEOUT_MS = 60_000;

/**
 * A held boot slot. Calling `release` frees it for the next waiter; it is
 * idempotent, and a no-op for a boot that was never gated.
 */
export type BootSlot = { release: () => void };

/**
 * The handle a boot the gate does not apply to holds: releasing it frees
 * nothing, because nothing was taken. Shared, since it carries no state.
 *
 * Exported so a caller that skips the gate before ever asking — `DocViewer`
 * does, for a rebuild — can name what it is holding rather than open-code a
 * second no-op that a reader has to recognize.
 */
export const UNGATED_BOOT_SLOT: BootSlot = { release: () => {} };

/**
 * Hold one of `maxConcurrentBoots` page-wide slots for the duration of a
 * document's boot.
 *
 * Resolves as soon as a slot is held — or immediately, with a no-op slot,
 * whenever the gate does not apply (a host manager is already scheduling
 * boots) or cannot be used (no Web Locks, a rejected request, a wait that
 * timed out). The caller must `release()` when the boot concludes, on the
 * failure path as much as the success one: a slot held by a boot that has
 * already given up blocks the siblings behind it.
 */
export async function acquireBootSlot(
    maxConcurrentBoots = doenetGlobalConfig.maxConcurrentBoots ??
        defaultMaxConcurrentBoots(),
): Promise<BootSlot> {
    if (isBootExternallyManaged()) {
        return UNGATED_BOOT_SLOT;
    }
    const locks = lockManager();
    if (!locks || maxConcurrentBoots < 1) {
        return UNGATED_BOOT_SLOT;
    }
    try {
        return await requestSlot(locks, maxConcurrentBoots);
    } catch (e) {
        console.warn("DoenetML boot gate unavailable; booting ungated:", e);
        return UNGATED_BOOT_SLOT;
    }
}

/**
 * Take one of the numbered slot locks, held until the returned `release`.
 *
 * Fast path: try every slot with `ifAvailable`, so an uncontended page never
 * waits. Slow path: queue on EVERY slot and take whichever frees first,
 * withdrawing the rest. A Web Locks waiter is served only by the name it
 * queued on, so parking on any one slot would leave the others' capacity
 * idle while boots serialize behind the chosen one.
 *
 * Web Locks callbacks hold the lock for as long as the promise they return is
 * unsettled, which is why each attempt parks on a promise resolved later by
 * `release` rather than doing its work inline.
 */
function requestSlot(
    locks: LockManagerLike,
    maxConcurrentBoots: number,
): Promise<BootSlot> {
    return new Promise<BootSlot>((resolveSlot, rejectSlot) => {
        // Set as soon as this boot's outcome is decided — a lock was granted,
        // or the backstop gave up waiting. A grant arriving afterwards is
        // released on the spot rather than held by nobody.
        let settled = false;
        let releaseLock: (() => void) | null = null;
        // Withdraws every still-queued slot request once the outcome is
        // decided. Aborting the request that was just granted is harmless:
        // the signal only drops requests not yet granted.
        const withdraw = new AbortController();

        const bypass = setTimeout(() => {
            if (settled) {
                return;
            }
            settled = true;
            withdraw.abort();
            console.warn(
                `DoenetML boot gate: no slot after ${GATE_WAIT_TIMEOUT_MS}ms; booting ungated.`,
            );
            resolveSlot(UNGATED_BOOT_SLOT);
        }, GATE_WAIT_TIMEOUT_MS);

        /**
         * The body of a granted lock request: a promise that stays pending
         * until the caller releases the slot, which is what holds the lock.
         */
        function holdUntilReleased() {
            return new Promise<void>((release) => {
                if (settled) {
                    release();
                    return;
                }
                settled = true;
                clearTimeout(bypass);
                withdraw.abort();
                releaseLock = release;
                resolveSlot({
                    release: () => {
                        releaseLock?.();
                        releaseLock = null;
                    },
                });
            });
        }

        function fail(e: unknown) {
            clearTimeout(bypass);
            withdraw.abort();
            if (!settled) {
                settled = true;
                rejectSlot(e);
            }
        }

        (async () => {
            // Fast path: is any slot free right now? Each iteration resolves
            // as soon as the grant decision is known — deliberately NOT when
            // the lock is released, which is why `gotIt` is settled from
            // inside the callback rather than by awaiting `request` itself.
            for (let i = 0; i < maxConcurrentBoots; i++) {
                if (settled) {
                    return;
                }
                const name = `${SLOT_LOCK_PREFIX}${i}`;
                const gotIt = await new Promise<boolean>((decided) => {
                    locks
                        .request(name, { ifAvailable: true }, (lock) => {
                            if (!lock) {
                                decided(false);
                                return Promise.resolve();
                            }
                            decided(true);
                            return holdUntilReleased();
                        })
                        .catch((e) => {
                            decided(false);
                            fail(e);
                        });
                });
                if (gotIt) {
                    return;
                }
            }
            if (settled) {
                return;
            }
            // Every slot is busy: queue on all of them and take whichever
            // frees first (see this function's doc comment). The first grant
            // settles the slot and withdraws the other requests; a second
            // grant racing that withdrawal is released on the spot by
            // `holdUntilReleased`'s `settled` check.
            for (let i = 0; i < maxConcurrentBoots; i++) {
                locks
                    .request(
                        `${SLOT_LOCK_PREFIX}${i}`,
                        { signal: withdraw.signal },
                        holdUntilReleased,
                    )
                    .catch((e: unknown) => {
                        if (
                            (e as { name?: string } | null)?.name !==
                            "AbortError"
                        ) {
                            fail(e);
                        }
                    });
            }
        })().catch(fail);
    });
}
