---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

fix: convert remaining hardcoded light-mode colors in renderers to dark-mode-aware CSS variables

Addresses all remaining DoenetML renderer pieces that displayed poorly or inaccessibly in dark mode after PR #1381 fixed section heading-boxes. Changes:

- **`DoenetML.css`**: Update `--lightBlue`, `--lightGreen`, `--lightRed`, `--lightOrange` in `[data-theme="dark"]` to dark-toned hover colors; add `--errorText`, `--indicatorHoverBlue`, `--buttonHoverBlue`, and `--doenetTagColor` theme variables; fix JSXGraph fullscreen background to use `var(--canvas)` instead of hardcoded `#ccc`; add a `.doenet-tag` CSS class that uses the tag-color variable.
- **`_error.tsx`**: Replace hardcoded `#ff9999` error box background with `var(--lightRed)` + `var(--canvasText)` text + `var(--mainRed)` border.
- **`footnote.tsx`**: Replace hardcoded `white` button background, `#e2e2e2` message panel background, and `#1A5A99` button text color with CSS variables (`var(--canvas)`, `var(--revealButtonSurface)`, `var(--whiteBlankLink)`). Fix tooltip to use `var(--canvas)` background with `var(--canvasText)` text.
- **`pretzel.css`**: Replace hardcoded `#333` borders with `var(--canvasText)` and `#ddd` answer background with `var(--revealButtonSurface)`.
- **`orbitalDiagram.tsx`** / **`orbitalDiagramInput.tsx`**: Replace hardcoded `#E2E2E2` row backgrounds with `var(--revealButtonSurface)`; replace hardcoded `#1A5A99` selected-row border and box stroke with `var(--mainBlue)`.
- **`mathInput.tsx`**: Replace `rgba(239,239,239,0.3)` disabled background (light-mode tint) with neutral `rgba(128,128,128,0.15)`.
- **`checkWork.css`**: Replace hardcoded `rgb(74,3,217)` / `rgb(161,129,224)` response-saved button colors with `var(--mainPurple)` + `color-mix`; keep the blue hover state on a dedicated `--buttonHoverBlue` so it still contrasts against `--mainBlue` in dark mode, while the green/red/orange statuses use theme-aware hover text and disabled buttons stay gray on hover.
- **`AnswerResponseButton.css`**: Fix the tooltip to use `var(--canvas)` + `var(--canvasText)` + border, and replace the remaining hardcoded `#aaa/#ccc/#ddd` button states with theme-aware surface/text colors.
- **`ref.css`**: Keep the main blue button text white, and move its hover background to `--buttonHoverBlue` with dark hover text so the hover state stays visible and readable in both themes.
- **`choiceInput.css`** / **`booleanInput.css`**: Use shared `--indicatorHoverBlue` so radio/checkbox hover indicators stay visible in dark mode without duplicating per-file overrides.
- **`graphControls/primitives/styles.ts`**: Replace hardcoded `#b00020` error text color with `var(--errorText)` (resolves ~2.7:1 contrast failure in dark mode).
- **`tag.tsx`**: Switch from inline `color: "var(--mainGreen)"` to a `.doenet-tag` CSS class backed by `--doenetTagColor`, avoiding a conflict with `--mainGreen` as a button background color.
