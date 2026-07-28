/**
 * The name a `<table>` or `<figure>` gives itself — "Table 2", "Figure 3" —
 * and the same name with the separator that joins it to the authored title or
 * caption.
 *
 * Both reach the reader, so they are *content* and follow the document's
 * language rather than the reader's UI language.
 *
 * ## Two values, one message
 *
 * The bare name is what `$table.tableName` reports and what a cross-reference
 * labels itself with, so it cannot carry punctuation. The renderer needs the
 * name *plus* its separator, because that separator is a translation decision
 * and it used to be a literal `": "` written into the JSX, where no locale
 * could reach it (#1582).
 *
 * They come out of one catalog message, selected on which pieces are present,
 * rather than out of a message and a suffix the code appends: a language that
 * orders or punctuates the join differently has to be able to say so in one
 * place, and two places could drift.
 *
 * The title or caption itself is not an argument. It is arbitrary marked-up
 * content the renderer prints after this string, so the branches that expect
 * one end in the separator — the same shape `composeTitlePrefix` uses for a
 * section.
 *
 * ## Written out one call per word
 *
 * `lint:i18n` reads translator call sites textually and only sees a key
 * spelled as a string literal, so `<table>`'s composer and `<figure>`'s are
 * two functions rather than one taking the message key as data.
 *
 * They are near-identical below, and that is deliberate rather than
 * unfinished. Four things differ — the message key, the English word, the name
 * `$parts` gives the branch that ends in a separator (`title` for a table's
 * child element, `caption` for a figure's), and the two result properties —
 * and the key has to stay a literal, so the only factoring left passes a bound
 * translator down to a shared body. That trades two functions a reader can
 * follow straight through for a callback plus two wrappers that are longer
 * than what they replace, and it hides the `t` call from the branch that
 * chooses its arguments. `sectionWords.js` makes the same trade for the same
 * reason. A third container joining these two would be the point to revisit
 * it.
 */

/**
 * What a `<table>` calls itself, bare and with its separator.
 *
 * @param t The document's translator.
 * @param enumeration The table's number as text, or `null` for an unnumbered
 *   table.
 * @param haveTitleChild Whether an authored `<title>` follows the name.
 * @returns `{ tableName, tableNamePrefix }` — the bare name, and the name the
 *   renderer prints before the title.
 */
export function composeTableName({ t, enumeration, haveTitleChild }) {
    const numbered = enumeration !== null;
    const englishName = numbered ? `Table ${enumeration}` : "Table";
    const args = { enumeration: enumeration ?? "" };

    const tableName = t(
        "table-name",
        { ...args, parts: numbered ? "numbered" : "unnumbered" },
        englishName,
    );

    if (!haveTitleChild) {
        // Nothing follows, so there is nothing to separate from. The prefix is
        // still the bare name rather than absent, because the prototype's
        // renderer prints it unconditionally.
        return { tableName, tableNamePrefix: tableName };
    }

    const tableNamePrefix = t(
        "table-name",
        { ...args, parts: numbered ? "numbered-title" : "unnumbered-title" },
        `${englishName}: `,
    );
    return { tableName, tableNamePrefix };
}

/**
 * What a `<figure>` calls itself, bare and with its separator.
 *
 * @param t The document's translator.
 * @param enumeration The figure's number as text, or `null` for an unnumbered
 *   figure.
 * @param haveCaptionChild Whether an authored `<caption>` follows the name.
 * @returns `{ figureName, figureNamePrefix }` — see {@link composeTableName}.
 */
export function composeFigureName({ t, enumeration, haveCaptionChild }) {
    const numbered = enumeration !== null;
    const englishName = numbered ? `Figure ${enumeration}` : "Figure";
    const args = { enumeration: enumeration ?? "" };

    const figureName = t(
        "figure-name",
        { ...args, parts: numbered ? "numbered" : "unnumbered" },
        englishName,
    );

    if (!haveCaptionChild) {
        return { figureName, figureNamePrefix: figureName };
    }

    const figureNamePrefix = t(
        "figure-name",
        {
            ...args,
            parts: numbered ? "numbered-caption" : "unnumbered-caption",
        },
        `${englishName}: `,
    );
    return { figureName, figureNamePrefix };
}
