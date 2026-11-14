/**
 * The math key strip for a page that embeds DoenetML activities in iframes.
 *
 * Built as `dist/math-key-strip.js` — a small dependency-free (no React)
 * classic script, published next to `coordinator.js`:
 *
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@doenet/standalone@<version>/math-key-strip.js"></script>
 * <script>
 *     const detach = DoenetMathKeyStrip.attach(
 *         document.querySelector("iframe#activity"),
 *         { theme: "system" },
 *     );
 * </script>
 * ```
 *
 * On a phone or tablet it draws a row of math keys (union, nth root,
 * fraction, ...) on top of the device's own keyboard while a math input in
 * that iframe has focus. The activity inside must be rendered with
 * `data-doenet-math-key-strip="true"`,
 * `data-doenet-external-virtual-keyboard-provided="true"` and
 * `data-doenet-add-virtual-keyboard="false"` (or the same viewer props). See
 * `host-math-key-strip.ts` in `@doenet/virtual-keyboard`.
 */

// Imported by source path, as `coordinator.ts` imports the shared core pool:
// `@doenet/virtual-keyboard`'s package entry carries React and the tray, and
// this script must carry neither.
import { attachMathKeyStrip } from "../../virtual-keyboard/src/virtual-keyboard/host-math-key-strip";

export { attachMathKeyStrip as attach };
