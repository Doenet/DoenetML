import type {
    AnnotatedElementRef,
    FlatDastRoot,
} from "@doenet/doenetml-worker-rust";

/**
 * Mutate `flatDast` to ensure that the root tag is a `<pretext>` tag with a division tag immediately inside
 * (either a `<book>` or a `<article>`).
 */
export function ensurePretextTag(
    flatDast: FlatDastRoot,
    ensuredDivisionType: "article" | "book" = "article",
) {
    const elements = flatDast.elements;
    // The root of the document is probably a `<document>` tag. If it is, remove it.
    if (flatDast.children.length === 1) {
        const firstChild = flatDast.children[0];
        if (
            isAnnotatedElementRef(firstChild) &&
            elements[firstChild.id].name === "document"
        ) {
            flatDast.children = elements[firstChild.id].children;
        }
    }

    const hasPretextElement = flatDast.children.find(
        (r) => isAnnotatedElementRef(r) && elements[r.id].name === "pretext",
    );
    if (!hasPretextElement) {
        const id = elements.length;
        elements.push({
            type: "element",
            name: "pretext",
            children: flatDast.children,
            attributes: {},
            data: { id },
        });
        flatDast.children = [{ id, annotation: "original" }];
    }
    console.log(flatDast)

    // XXX: Finish ensuring the division
}

function isAnnotatedElementRef(node: any): node is AnnotatedElementRef {
    return node?.id != null && node?.type == null;
}
