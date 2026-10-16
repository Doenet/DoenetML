/**
 * Column widths for a printed `<tabular>`, shared by the `<tabular>` and
 * `<spreadsheet>` exporters.
 *
 * PreTeXt reads a `<col width>` as a percentage of the line, and applies it
 * only to a cell holding a `<p>`, which LaTeX sets as a paragraph box of that
 * width. Around each box LaTeX adds the column's padding and rule, outside the
 * width; the viewer counts a cell's padding inside it. So widths that fill a
 * table on screen would overrun the printed line, and each column given a
 * width gives up the padding's share of the line first.
 */

/** The width, in points, of the line in PreTeXt's default LaTeX article. */
export const LINE_POINTS = 340;

/**
 * The points LaTeX spends on the padding and rule around each column: 6pt of
 * `\tabcolsep` on each side and a 0.4pt rule.
 */
const COLUMN_PADDING_POINTS = 12.4;

/**
 * The share, as a percentage, of a line `lineFraction` of the default one
 * that the padding and rule around one column take. A `<tabular width="50%">`
 * is set in a box half the line wide, where the same points are twice the
 * share.
 */
export function columnPaddingPercent(lineFraction = 1) {
    return (COLUMN_PADDING_POINTS / (LINE_POINTS * lineFraction)) * 100;
}

/**
 * The `<col>` widths to print, as percentages of the line, for columns whose
 * widths on screen are `percents` of the table (`null` for a column with no
 * percentage width).
 *
 * They are shares of what is left once `reserved` percent of the line is set
 * aside and each column with a width has given up its padding. Widths
 * totalling more than 100%, which the viewer lets overflow, are scaled down to
 * fit, keeping their proportions: PreTeXt stops the whole build if a
 * tabular's `<col>` widths add up to more than 100%. Rounding down to
 * hundredths keeps the total within what is left, which the padding keeps at
 * least one column's padding under 100, clear of the floating-point slack in
 * PreTeXt's own check of the sum. When the padding alone fills the line there
 * is nothing left, and every width comes back 0, to be written as no width.
 */
export function printedColumnWidths(
    percents: (number | null)[],
    { reserved = 0, lineFraction = 1 } = {},
): (number | null)[] {
    const numWithWidth = percents.filter((percent) => percent).length;
    const available = Math.max(
        0,
        100 - reserved - numWithWidth * columnPaddingPercent(lineFraction),
    );
    const total = percents.reduce<number>(
        (sum, percent) => sum + (percent ?? 0),
        0,
    );
    return percents.map((percent) =>
        percent === null
            ? null
            : Math.floor(percent * (available / Math.max(total, 100)) * 100) /
              100,
    );
}
