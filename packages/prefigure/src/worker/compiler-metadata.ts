/**
 * Lightweight metadata about the PreFigure compiler that is safe to import
 * from the main thread without loading the heavy compiler module.
 *
 * Keep this file free of imports so it tree-shakes to a tiny constant.
 */
export const PREFIG_WHEEL_FILENAME = "prefig-0.5.13-py3-none-any.whl";
