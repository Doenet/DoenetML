import { EditorView } from "@codemirror/view";
import { DoenetSourceObject } from "@doenet/lsp-tools";
import type { DastElement } from "@doenet/parser";

/**
 * Checks if auto-closing should be triggered and returns the closing tag if so.
 *
 * @param docText - The current document text
 * @param cursorPos - The cursor position where '>' will be inserted
 * @returns The closing tag to insert (e.g., '</tag>'), or null if no auto-close should happen
 */
export function getAutoCloseTag(
    docText: string,
    cursorPos: number,
): string | null {
    // Create a hypothetical document with '>' inserted to check the context
    const hypotheticalDoc =
        docText.slice(0, cursorPos) + ">" + docText.slice(cursorPos);

    const source = new DoenetSourceObject();
    source.setSource(hypotheticalDoc);

    // Get the element context at the position of the '>' we're inserting
    // This should be inside the opening tag
    const context = source.elementAtOffsetWithContext(cursorPos);

    // Only proceed if we found an element
    if (!context.node) {
        return null;
    }

    // Only auto-close if we're in the opening tag itself (typing the tag name or in the opening tag)
    // Not if we're in attributes, body, or unknown positions
    // Note: We also allow the "attributeName" case for tags with valueless attributes like <tag hide>
    if (
        context.cursorPosition !== "openTagName" &&
        context.cursorPosition !== "openTag" &&
        context.cursorPosition !== "attributeName"
    ) {
        return null;
    }

    const element: DastElement = context.node;
    const tagName = element.name;

    // Don't insert if tag name is empty (e.g., just typed `<`)
    if (!tagName) {
        return null;
    }

    // Check if the element already has a closing tag
    const completionStatus = source.isCompleteElement(element);

    if (completionStatus.closed) {
        // Found matching closing tag
        return null;
    } else {
        // No closing tag exists, so insert one
        return `</${tagName}>`;
    }
}

/**
 * CodeMirror input handler extension that automatically inserts a closing tag
 * when the user types `>` to close an opening tag.
 *
 * Behavior:
 * - Uses the DoenetSourceObject parser to detect tag context at cursor position
 * - Checks if a matching close tag already exists using parser-based completion status
 * - If no closing tag exists, inserts `</tagName>` and positions cursor between tags
 * - Skips insertion for self-closing tags and when closing tag already present
 * - Properly handles less-than as text operator (e.g., `x < y`)
 *
 * @returns A CodeMirror InputHandler that returns `true` to indicate the input was handled,
 *          or `false` to fall through to default handling
 */
export const autoCloseTagExtension = EditorView.inputHandler.of(
    (view, from, to, insertedText) => {
        if (insertedText !== ">" || from !== to) {
            return false;
        }

        const docText = view.state.doc.toString();
        const closeTag = getAutoCloseTag(docText, from);

        if (!closeTag) {
            return false;
        }

        view.dispatch({
            changes: { from, to, insert: `>${closeTag}` },
            selection: { anchor: from + 1 },
        });
        return true;
    },
);
