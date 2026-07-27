/**
 * The words `true` and `false` are shown as, and reading one back.
 *
 * A boolean has two spellings in a translated document and they do different
 * jobs. The *value* is `true`/`false`: that is DoenetML syntax, it is what an
 * author writes, what `<award>` compares against, and what saved state holds,
 * and it stays English in every language. The *display* is prose — a reader
 * reads it in the sentence it sits in — so it follows `documentLocale`.
 *
 * Which means anything that reads a boolean back out of text has to accept
 * both: `$b.text` bound to a `<textInput>` will be handed whichever spelling
 * the reader saw, while an author's own `<updateValue newValue="true">`
 * arrives in the syntax spelling. {@link booleanFromWord} takes either, which
 * is the whole reason it exists rather than a `text === "true"` at each site.
 */

/** The word `value` displays in the translator's language. */
export function booleanWord(value, t) {
    return value ? t("boolean-true") : t("boolean-false");
}

/**
 * The boolean `text` names, or `undefined` if it names neither.
 *
 * Accepts the English syntax spelling always, and the translated spelling as
 * well — case-insensitively on both, and only case-insensitively, which is
 * exactly what the English-only comparison here did before.
 */
export function booleanFromWord(text, t) {
    const word = normalize(text);
    if (word === "true" || word === normalize(booleanWord(true, t))) {
        return true;
    }
    if (word === "false" || word === normalize(booleanWord(false, t))) {
        return false;
    }
    return undefined;
}

function normalize(text) {
    return String(text).toLowerCase();
}
