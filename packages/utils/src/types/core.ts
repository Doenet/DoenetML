/**
 * Numeric identifier assigned to every component instance in a DoenetML
 * document. Bare `number` everywhere it appears today; this alias makes the
 * intent visible at type-declaration sites.
 */
export type ComponentIdx = number;

/**
 * Return type of `setTimeout` / `setInterval`. Differs between Node
 * (`NodeJS.Timeout`) and the browser/Web Worker (`number`); the alias hides
 * that and pairs with the `| null` we set when clearing.
 */
export type TimerHandle = ReturnType<typeof setTimeout> | null;
