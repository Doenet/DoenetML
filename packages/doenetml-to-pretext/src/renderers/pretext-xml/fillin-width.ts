/**
 * How many characters wide a blank drawn on the text metric is, when the input it stands
 * for gives no width of its own.
 *
 * PreTeXt draws the two kinds of blank to different scales. A text blank is a span sized
 * `5n/11` em for `n` characters (`pretext-html.xsl`, the `fillin` template). A blank in
 * math is `\fillinmath`, which lays out capital X in math italic — far wider per character
 * — so a `<mathInput>`'s eight characters measure about 9.45em rather than the 3.6em the
 * same count would give in text.
 *
 * Left at a count chosen for text, a text blank printed beside a math one looked like a
 * different kind of answer space. 21 characters is `9.55em`, which draws the two the same
 * length.
 */
export const TEXT_FILLIN_CHARACTERS = 21;
