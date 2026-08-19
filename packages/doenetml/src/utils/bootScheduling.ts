/**
 * Who schedules this realm's boot (#1708).
 *
 * Several embedding layers cap how many DoenetML documents may boot at once,
 * because each boot parses a multi-MB bundle and starts a core worker. They
 * all live OUTSIDE the realm they gate — on the parent page — and each grew
 * its own way of telling the child about it:
 *
 * - `@doenet/standalone`'s parent-page coordinator marks activity URLs with a
 *   fragment token (`coordinated-mode.ts`);
 * - `@doenet/doenetml-iframe` bakes `doenetWindowedViewer` into the srcdoc of
 *   a viewer under a `mountPolicy`, and `doenetManagedEditor` into the srcdoc
 *   of an editor whose host schedules it.
 *
 * This module reduces those to one question — *does something outside this
 * realm already own my boot scheduling?* — so in-realm boot policy has a
 * single thing to consult instead of re-deriving the answer per embedding.
 *
 * The answer is carried on `doenetGlobalConfig.externallyManagedBoot`, set by
 * whichever entry point knows (the standalone bundle for the coordinator, the
 * iframe entry points for their baked flags). It is deliberately *not*
 * discovered here: only the embedding layer can know, and a wrong guess is
 * expensive in both directions — see `isBootExternallyManaged`.
 */

import { doenetGlobalConfig } from "../global-config";

/**
 * Does an embedding layer outside this realm already schedule its boot?
 *
 * The intended consumer is in-realm boot policy that must not double-gate: a
 * page-wide throttle added inside the bundle has to stand down when a host
 * throttle is already in force, because two independent semaphores compose
 * multiplicatively and serialize a page that neither one alone would slow.
 *
 * Answering `false` when a host manager *is* present is the costly error (the
 * double-gating above). Answering `true` when none is present is costly too —
 * an in-realm throttle would stand down and leave the page ungated — but that
 * is exactly today's behavior, so it degrades rather than regresses. Hence the
 * default: unset means unmanaged.
 */
export function isBootExternallyManaged(): boolean {
    return doenetGlobalConfig.externallyManagedBoot === true;
}

/**
 * Record that an embedding layer outside this realm owns its boot scheduling.
 *
 * Called by the entry point that knows — before any viewer renders, since boot
 * policy is consulted at core creation. Write-once in spirit: an embedding
 * cannot stop managing a realm partway through, and a later `false` would let
 * an in-realm throttle engage underneath a host manager that is still running.
 */
export function markBootExternallyManaged() {
    doenetGlobalConfig.externallyManagedBoot = true;
}
