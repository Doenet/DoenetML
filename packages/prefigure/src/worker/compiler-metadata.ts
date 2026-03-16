/**
 * Lightweight metadata about the PreFigure compiler that is safe to import
 * from the main thread without loading the heavy compiler module.
 *
 * This file centralizes the PreFigure wheel/runtime version used by the
 * compiler and wheel-sync checks. It does not represent npm package versions
 * from other packages (for example, @doenet/prefigure publish tags consumed by
 * @doenet/doenetml defaults).
 *
 * See packages/doenetml/src/Viewer/renderers/utils/prefigureConfig.ts for the
 * independently managed default CDN module URL/publish tag used by
 * @doenet/doenetml.
 *
 * Keep this file free of imports so it tree-shakes to a tiny constant.
 */
export const PREFIG_VERSION = "0.5.13";
export const PREFIG_WHEEL_FILENAME = `prefig-${PREFIG_VERSION}-py3-none-any.whl`;
