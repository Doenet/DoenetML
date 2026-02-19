import { Text } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

/**
 * Extracts the name of the opening tag that would be closed by typing `>` at the cursor position.
 *
 * Scans backward from the cursor to find the nearest unmatched `<` and extracts the tag name,
 * handling quotes and special-tag markers (`!`, `?`, `/`) to avoid false positives.
 *
 * @param doc - The CodeMirror document text
 * @param cursorOffset - The cursor offset in the document
 * @returns The tag name if an opening tag is detected, otherwise null
 *
 * @example
 * // Given "<matrix" with cursor at offset 7
 * getOpeningTagNameAtCursor(doc, 7) // => "matrix"
 *
 * // Given "</matrix" (closing tag)
 * getOpeningTagNameAtCursor(doc, 8) // => null
 *
 * // Given '<title text="hello' (cursor in quoted attribute)
 * getOpeningTagNameAtCursor(doc, 17) // => null
 */
export function getOpeningTagNameAtCursor(
    doc: Text,
    cursorOffset: number,
): string | null {
    const beforeCursor = doc.sliceString(0, cursorOffset);
    const openTagStart = beforeCursor.lastIndexOf("<");
    if (openTagStart === -1) {
        return null;
    }

    const tagFragment = beforeCursor.slice(openTagStart);

    if (/^<\s*[!/?]/.test(tagFragment)) {
        return null;
    }

    if (/\/\s*$/.test(tagFragment)) {
        return null;
    }

    let inSingleQuote = false;
    let inDoubleQuote = false;
    for (const char of tagFragment) {
        if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
        }
    }
    if (inSingleQuote || inDoubleQuote) {
        return null;
    }

    const tagNameMatch = tagFragment.match(/^<([a-zA-Z][^\s/>]*)/);
    if (!tagNameMatch) {
        return null;
    }

    return tagNameMatch[1] ?? null;
}

/**
 * Detects if an opening tag already has a matching closing tag appearing later in the document.
 *
 * Performs a forward scan from the cursor position, accounting for:
 * - Nested same-name tags (using depth tracking)
 * - Self-closing tags (`/>`)
 * - HTML comments and special tags (`<!...>`, `<?...?>`)
 * - Quoted attribute values
 *
 * Used to avoid inserting duplicate closing tags when they already exist ahead.
 *
 * @param doc - The CodeMirror document text
 * @param cursorOffset - The cursor offset (typically right after `>` insertion)
 * @param tagName - The opening tag name to match
 * @returns true if a matching closing tag is found, false otherwise
 *
 * @example
 * // Given "<tag></tag>" with cursor at offset 5 (right after >)
 * hasMatchingCloseTagAhead(doc, 5, "tag") // => true
 *
 * // Given "<tag   text </tag>" with cursor at offset 4 (where > will be typed)
 * hasMatchingCloseTagAhead(doc, 4, "tag") // => true
 *
 * // Given "<tag <tag>inner</tag> outer</tag>" with cursor at offset 4 (where > will be typed)
 * // Matches the final </tag> (accounts for nesting)
 * hasMatchingCloseTagAhead(doc, 4, "tag") // => true
 *
 * // Given "<tag <otherTag>hi</otherTag>" with cursor at offset 4 (where > will be typed)
 * hasMatchingCloseTagAhead(doc, 4, "tag") // => false
 */
export function hasMatchingCloseTagAhead(
    doc: Text,
    cursorOffset: number,
    tagName: string,
): boolean {
    const remainingText = doc.sliceString(cursorOffset);
    let depth = 1;
    let index = 0;

    /**
     * Advances index forward to find the closing `>` of a tag,
     * respecting single/double quotes to avoid false matches inside attribute values.
     *
     * @param start - Starting index to search from
     * @returns Index of closing `>`, or -1 if not found before end of document
     */
    const skipUntilTagEnd = (start: number) => {
        let inSingleQuote = false;
        let inDoubleQuote = false;
        for (let i = start; i < remainingText.length; i++) {
            const char = remainingText[i];
            if (char === "'" && !inDoubleQuote) {
                inSingleQuote = !inSingleQuote;
            } else if (char === '"' && !inSingleQuote) {
                inDoubleQuote = !inDoubleQuote;
            } else if (char === ">" && !inSingleQuote && !inDoubleQuote) {
                return i;
            }
        }
        return -1;
    };

    while (index < remainingText.length) {
        const ltIndex = remainingText.indexOf("<", index);
        if (ltIndex === -1) {
            return false;
        }

        if (remainingText.startsWith("<!--", ltIndex)) {
            const commentEnd = remainingText.indexOf("-->", ltIndex + 4);
            if (commentEnd === -1) {
                return false;
            }
            index = commentEnd + 3;
            continue;
        }

        if (
            remainingText.startsWith("<!", ltIndex) ||
            remainingText.startsWith("<?", ltIndex)
        ) {
            const specialTagEnd = skipUntilTagEnd(ltIndex + 2);
            if (specialTagEnd === -1) {
                return false;
            }
            index = specialTagEnd + 1;
            continue;
        }

        const isCloseTag = remainingText.startsWith("</", ltIndex);
        const tagNameMatch = remainingText
            .slice(ltIndex)
            .match(/^<\/?([a-zA-Z][^\s/>]*)/);
        if (!tagNameMatch) {
            index = ltIndex + 1;
            continue;
        }

        const foundTagName = tagNameMatch[1];
        const tagEnd = skipUntilTagEnd(ltIndex + 1);
        if (tagEnd === -1) {
            return false;
        }

        if (foundTagName === tagName) {
            if (isCloseTag) {
                depth -= 1;
                if (depth === 0) {
                    return true;
                }
            } else {
                const tagContent = remainingText.slice(ltIndex, tagEnd + 1);
                const isSelfClosing = /\/\s*>$/.test(tagContent);
                if (!isSelfClosing) {
                    depth += 1;
                }
            }
        }

        index = tagEnd + 1;
    }

    return false;
}

/**
 * CodeMirror input handler extension that automatically inserts a closing tag
 * when the user types `>` to close an opening tag.
 *
 * Behavior:
 * - Detects the tag name from the opening tag at cursor position
 * - Checks if a matching close tag already exists ahead in the document
 * - If no close tag exists, inserts `</tagName>` and positions cursor between tags
 * - Skips insertion for self-closing tags (`/>`) and when close tag already present
 *
 * @returns A CodeMirror InputHandler that returns `true` to indicate the input was handled,
 *          or `false` to fall through to default handling
 */
export const autoCloseTagExtension = EditorView.inputHandler.of(
    (view, from, to, insertedText) => {
        if (insertedText !== ">" || from !== to) {
            return false;
        }

        const tagName = getOpeningTagNameAtCursor(view.state.doc, from);
        if (!tagName) {
            return false;
        }

        if (hasMatchingCloseTagAhead(view.state.doc, from, tagName)) {
            return false;
        }

        const closeTag = `</${tagName}>`;
        view.dispatch({
            changes: { from, to, insert: `>${closeTag}` },
            selection: { anchor: from + 1 },
        });
        return true;
    },
);
