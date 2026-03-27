const defaultAllowedDiagnosticTags = new Set([
    "P",
    "CODE",
    "EM",
    "STRONG",
    "BR",
]);

/**
 * Restrict rendered diagnostic markdown to a small allowlist of formatting tags.
 * Non-allowed elements are converted to text and attributes are stripped.
 */
export function sanitizeDiagnosticHtml(
    html: string,
    allowedTags: Set<string> = defaultAllowedDiagnosticTags,
): string {
    const template = document.createElement("template");
    template.innerHTML = html;

    const walker = document.createTreeWalker(
        template.content,
        NodeFilter.SHOW_ELEMENT,
    );
    const elements: Element[] = [];

    while (walker.nextNode()) {
        elements.push(walker.currentNode as Element);
    }

    for (const element of elements) {
        if (!allowedTags.has(element.tagName)) {
            element.replaceWith(
                document.createTextNode(element.textContent ?? ""),
            );
            continue;
        }

        for (const { name } of Array.from(element.attributes)) {
            element.removeAttribute(name);
        }
    }

    return template.innerHTML;
}
