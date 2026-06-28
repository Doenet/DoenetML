---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

fix: convert remaining hardcoded light-mode colors in renderers to dark-mode-aware CSS variables

Addresses all remaining DoenetML renderer pieces that displayed poorly or inaccessibly in dark mode after PR #1381 fixed section heading-boxes. Changes:

- **`DoenetML.css`**: Update `--lightBlue`, `--lightGreen`, `--lightRed`, `--lightOrange` in `[data-theme="dark"]` to dark-toned hover colors; add `--errorText` variable (bright red for error text on dark canvas); fix JSXGraph fullscreen background to use `var(--canvas)` instead of hardcoded `#ccc`; add `.doenet-tag` CSS class with a brighter green for dark mode.
- **`_error.tsx`**: Replace hardcoded `#ff9999` error box background with `var(--lightRed)` + `var(--canvasText)` text + `var(--mainRed)` border.
- **`footnote.tsx`**: Replace hardcoded `white` button background, `#e2e2e2` message panel background, and `#1A5A99` button text color with CSS variables (`var(--canvas)`, `var(--revealButtonSurface)`, `var(--whiteBlankLink)`). Fix tooltip to use `var(--canvas)` background with `var(--canvasText)` text.
- **`pretzel.css`**: Replace hardcoded `#333` borders with `var(--canvasText)` and `#ddd` answer background with `var(--revealButtonSurface)`.
- **`orbitalDiagram.tsx`** / **`orbitalDiagramInput.tsx`**: Replace hardcoded `#E2E2E2` row backgrounds with `var(--revealButtonSurface)`; replace hardcoded `#1A5A99` selected-row border and box stroke with `var(--mainBlue)`.
- **`mathInput.tsx`**: Replace `rgba(239,239,239,0.3)` disabled background (light-mode tint) with neutral `rgba(128,128,128,0.15)`.
- **`checkWork.css`**: Replace hardcoded `rgb(74,3,217)` / `rgb(161,129,224)` response-saved button colors with `var(--mainPurple)` + `color-mix` hover; add dark-mode `color: white` overrides for all check-work button hover states (previously used `color: black` written for light-mode pastels, now incompatible with dark hover backgrounds).
- **`AnswerResponseButton.css`**: Fix tooltip to use `var(--canvas)` + `var(--canvasText)` + border instead of `var(--mainGray)` background (which gave ~2.3:1 contrast with white text in dark mode).
- **`ref.css`**: Add `color: black` to hover state for light-mode readability (white text on light `--lightBlue` was only ~2.0:1); add `[data-theme="dark"]` override to restore `color: white` for dark-mode readability.
- **`choiceInput.css`** / **`booleanInput.css`**: Add dark-mode overrides for indicator hover color (`#5b8cb5`) since darkened `--lightBlue` is nearly invisible against the indicator's gray background.
- **`graphControls/primitives/styles.ts`**: Replace hardcoded `#b00020` error text color with `var(--errorText)` (resolves ~2.7:1 contrast failure in dark mode).
- **`tag.tsx`**: Switch from inline `color: "var(--mainGreen)"` to a `.doenet-tag` CSS class with a brighter dark-mode green (`#5cb870`), avoiding a conflict with `--mainGreen` as a button background color.
