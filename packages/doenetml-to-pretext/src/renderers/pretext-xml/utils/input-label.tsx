import React from "react";

/**
 * An input's label as PreTeXt content, followed by a space to keep it off the blank, or
 * `null` when there is none. The label is text with any math in it delimited by `\(` and
 * `\)`, which is written as `<m>`.
 */
export function inputLabelContent(label: string | undefined): React.ReactNode {
    const trimmed = label?.trim() || "";
    if (!trimmed) {
        return null;
    }
    // Every odd-indexed part is math.
    const parts = trimmed.split(/\\\(|\\\)/);
    return [
        ...parts.map((part, index) =>
            index % 2 === 0 ? part : <m key={index}>{part}</m>,
        ),
        " ",
    ];
}
