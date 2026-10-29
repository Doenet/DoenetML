/**
 * Name of the window flag the srcdoc's standalone `<script>` sets from its
 * `onerror` handler when the bundle cannot be fetched (e.g. a 404 for a
 * DoenetML version that was never published). The in-iframe boot script
 * polls for the bundle; checking this flag lets it report the failure to the
 * parent right away instead of waiting out the poll's timeout, so the wrapper
 * can fall back from an `xmlns`-detected version without a long blank iframe.
 *
 * Shared between `utils.ts` (which writes the handler into the srcdoc) and the
 * iife entry points (which read the flag), so the two cannot drift apart.
 */
export const STANDALONE_LOAD_FAILED_FLAG = "__doenetStandaloneLoadFailed";
