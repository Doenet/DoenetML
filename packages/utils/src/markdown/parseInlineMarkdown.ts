/**
 * Inline-only markdown tokenizer for short schema-derived text (component
 * summaries, attribute/property descriptions). Recognises three constructs —
 * `` `code` ``, `**strong**`, and `*em*` — which is the full set the schema
 * uses today. Anything else is emitted as literal text.
 *
 * Returning structured tokens (rather than HTML or React) lets each surface
 * — the autocomplete info popup, the context-help panel — render to its
 * native node type without sharing a sanitizer.
 */

export type InlineToken =
    | { kind: "text"; text: string }
    | { kind: "code"; text: string }
    | { kind: "em"; text: string }
    | { kind: "strong"; text: string };

// `**strong**` is matched before `*em*` so `**x**` does not degrade to two
// em runs. `[^`]+` / `[^*]+` keep each construct on a single, non-nested
// span — matching the schema's actual usage and keeping the parser O(n).
const PATTERN = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function parseInlineMarkdown(text: string): InlineToken[] {
    const tokens: InlineToken[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = PATTERN.exec(text)) !== null) {
        if (m.index > lastIndex) {
            tokens.push({
                kind: "text",
                text: text.slice(lastIndex, m.index),
            });
        }
        if (m[1] !== undefined) {
            tokens.push({ kind: "code", text: m[1] });
        } else if (m[2] !== undefined) {
            tokens.push({ kind: "strong", text: m[2] });
        } else if (m[3] !== undefined) {
            tokens.push({ kind: "em", text: m[3] });
        }
        lastIndex = m.index + m[0].length;
    }
    if (lastIndex < text.length) {
        tokens.push({ kind: "text", text: text.slice(lastIndex) });
    }
    return tokens;
}
