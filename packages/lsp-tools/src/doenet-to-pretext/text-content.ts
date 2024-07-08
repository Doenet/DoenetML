import type {
    FlatDastRoot,
    FlatDastElement,
    FlatDastElementContent,
    DastAttribute,
    AnnotatedElementRef,
} from "@doenet/doenetml-worker-rust";
import { DastMacro, toXml } from "@doenet/parser";

export type FlatDastAttributeContent = DastAttribute["children"][number];

export function isFlatDastRoot(node: any): node is FlatDastRoot {
    return node?.type === "root";
}

function isAnnotatedElementRef(node: any): node is AnnotatedElementRef {
    return node?.id != null && node?.type == null;
}

/**
 * Get the text content of a flat DAST node.
 */
export function textContent(
    node: FlatDastElementContent | FlatDastRoot | FlatDastAttributeContent,
    elements: FlatDastElement[],
): string {
    if (typeof node === "string") {
        return node;
    }
    if (isFlatDastRoot(node)) {
        return node.children.map((n) => textContent(n, elements)).join("");
    }

    const elm = isAnnotatedElementRef(node) ? elements[node.id] : node;

    if (!elm) {
        throw new Error(`Element with id ${(node as any)?.id} not found`);
    }
    switch (elm.type) {
        case "element":
            return elm.children.map((n) => textContent(n, elements)).join("");
        case "text":
            return elm.value;
        case "function":
        case "macro":
            return toXml(elm as DastMacro);

        default:
            const _unreachable: void = elm;
    }

    return "";
}
