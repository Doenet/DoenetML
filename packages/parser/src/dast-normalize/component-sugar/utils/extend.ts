import { DastElement } from "../../../types";

/**
 * Whether `node` is written with `extend`.
 *
 * An extend is the same component as its source again, so it takes no
 * content of its own: what is written inside it, and the attributes that
 * decide its content, are reported as errors where it is expanded (#2404).
 * A sugar that would turn those attributes into children, or wrap nothing in
 * a generated child, is skipped for it, so that only what the author wrote
 * is reported, and a bare extend has nothing to report.
 */
export function isWrittenWithExtend(node: DastElement) {
    return Object.keys(node.attributes).some(
        (attrName) => attrName.toLowerCase() === "extend",
    );
}

/**
 * Whether `node` is written with `copy` or `copyWithState` and has nothing
 * written inside it but blank text.
 *
 * Such a copy is its source's DoenetML with the attributes written on it
 * applied. A sugar that would wrap its (empty) content in a generated child
 * is skipped, so that the copy adds no child to its source's, and an
 * attribute the sugar would move to that child stays on the copy, where the
 * copy applies it to the source's own child (#2217).
 */
export function isChildlessCopy(node: DastElement) {
    return (
        Object.keys(node.attributes).some((attrName) =>
            ["copy", "copywithstate"].includes(attrName.toLowerCase()),
        ) &&
        node.children.every(
            (child) => child.type === "text" && child.value.trim() === "",
        )
    );
}

/**
 * Whether `node` is written with `extend`, `copy` or `copyWithState`,
 * whatever is written inside it. Such a component has its source's children,
 * so a sugar that adds the children every such component has (a
 * `<fractionInput>`'s two boxes) is skipped for it: they come from the source.
 */
export function isMadeFromSource(node: DastElement) {
    return Object.keys(node.attributes).some((attrName) =>
        ["extend", "copy", "copywithstate"].includes(attrName.toLowerCase()),
    );
}
