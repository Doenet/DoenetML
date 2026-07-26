/**
 * Report a broken invariant inside the core to the browser console.
 *
 * These are the messages the core writes when something about *itself* does
 * not add up: a state variable it just asked for that isn't there, an array
 * index past the end of the array it belongs to, a parent that vanished
 * between deciding to add children and adding them. They name state
 * variables, dependency names and component indices — none of which appear in
 * a document — and they show up only when we have a bug.
 *
 * So they are developer logs rather than diagnostics: a diagnostic is
 * addressed to whoever is reading the document, rendered in that reader's
 * language, and something they can act on. These have no code and no catalog
 * entry, because their only audience is us, on the occasion we ask someone to
 * open the console and read back what it says.
 *
 * The message is plain English composed at the call site. The
 * `DoenetML internal:` prefix makes the family greppable in a console full of
 * everything else on the page.
 *
 * `console.warn` follows what the worker already does for "this shouldn't have
 * happened, carrying on anyway" (see `Point.js`'s invalid `pointRole`,
 * `Sort.js`'s invalid `type`); `console.error` is kept for the genuinely
 * thrown.
 */
export function reportInternalError(message: string) {
    console.warn(`DoenetML internal: ${message}`);
}
