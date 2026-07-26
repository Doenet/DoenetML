/**
 * Report a broken invariant inside the core to the browser console.
 *
 * These are the messages the core writes when something about *itself* does
 * not add up: a state variable it just asked for that isn't there, an array
 * index past the end of the array it belongs to, a parent that vanished
 * between deciding to add children and adding them. An author can do nothing
 * about any of them. They name state variables, dependency names and
 * component indices — none of which appear in a document — and they show up
 * only when we have a bug.
 *
 * So they are deliberately *not* diagnostics. A diagnostic is addressed to
 * whoever is reading the document, is rendered in that reader's language, and
 * is something they can act on; anything that fails those tests is a developer
 * log, and belongs here. There is no code and no catalog entry: a code exists
 * to be filtered on and cited, and a catalog entry exists to be translated,
 * and neither is wanted for a line whose only audience is us, on the occasion
 * we ask someone to open the console and read back what it says.
 *
 * The message is plain English composed at the call site, and each one is
 * word-for-word what the diagnostic used to say, so a line someone recognizes
 * from before still reads the same. The `DoenetML internal:` prefix is the
 * only addition — it makes the family greppable in a console full of
 * everything else on the page.
 *
 * `console.warn` rather than `console.error` follows what the worker already
 * does for "this shouldn't have happened, carrying on anyway" (see
 * `Point.js`'s invalid `pointRole`, `Sort.js`'s invalid `type`);
 * `console.error` is kept for the genuinely thrown.
 */
export function reportInternalError(message: string) {
    console.warn(`DoenetML internal: ${message}`);
}
