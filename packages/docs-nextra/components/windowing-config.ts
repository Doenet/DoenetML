/**
 * Page-wide budgets for windowed mounting of embedded DoenetML examples in the
 * docs site (#1441 stream B, applied to the docs host).
 *
 * A live example is its own iframe realm plus a ~100 MB-class core worker;
 * reference pages embed up to ~24 of them, so a page that mounts every example
 * at once can cost multiple GB. Windowing keeps only what the reader can see
 * live: viewers use the built-in `mountPolicy` from `@doenet/doenetml-iframe`;
 * editors (which have no built-in support) use the docs-layer wrapper and
 * manager. These constants configure both paths from one place.
 */

/**
 * Master switch. Set to `false` to render every example the historical way
 * (immediate mount, no windowing) — a clean rollback / A-B toggle.
 */
export const WINDOWING_ENABLED = true;

// ---- Viewers (built-in @doenet/doenetml-iframe `mountPolicy`) ----

/** Page-wide budget of simultaneously live viewers. */
export const VIEWER_MAX_LIVE = 3;
/** Page-wide cap on how many viewers may boot their iframe realm at once. */
export const VIEWER_MAX_CONCURRENT_BOOTS = 2;
/**
 * `IntersectionObserver` rootMargin for viewers. Kept below the package
 * default ("1000px") because the built-in soft-budget rule never parks a
 * currently-visible viewer, so the live count floors at the number
 * simultaneously inside this margin — a large margin undercuts the budget on a
 * dense page. Viewers auto-size, so a modest lead still lets height correction
 * happen before the example scrolls into view.
 */
export const VIEWER_VISIBLE_MARGIN = "600px";
/** How long a viewer must be off-screen before it may be parked. */
export const VIEWER_PARK_DELAY_MS = 2000;

// ---- Editors (docs-layer wrapper + manager) ----

/** Page-wide budget of simultaneously mounted editors. */
export const EDITOR_MAX_LIVE = 3;
/** Page-wide cap on how many editors may boot their iframe realm at once. */
export const EDITOR_MAX_CONCURRENT_BOOTS = 2;
/**
 * `IntersectionObserver` rootMargin for editors. Smaller than the viewer
 * margin: editors have a fixed known height (no layout-shift risk from booting
 * late), so we keep the near-viewport set tight.
 */
export const EDITOR_VISIBLE_MARGIN = "400px";
/** How long an editor must be off-screen before it may be unloaded. */
export const EDITOR_PARK_DELAY_MS = 2000;
/**
 * Fallback for releasing an editor's boot slot if the boot never signals
 * completion (load error, wedged worker), so the boot queue can't wedge. The
 * `documentStructureCallback` normally frees the slot as soon as the editor
 * renders; this is only the backstop.
 */
export const EDITOR_BOOT_WATCHDOG_MS = 30000;
