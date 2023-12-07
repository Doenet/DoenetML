import { DastElement, DastElementContent, DastRootContent } from "./types";

export const isDastElement = (
    rootContent: DastRootContent,
): rootContent is DastElement => rootContent.type === "element";

export const isDastElementContent = (
    rootContent: DastRootContent,
): rootContent is DastElementContent =>
    [
        "cdata",
        "comment",
        "element",
        "instruction",
        "text",
        "error",
        "macro",
        "function",
    ].includes(rootContent.type);
