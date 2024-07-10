import type {
    AnnotatedElementRef,
    FlatDastRoot,
    FlatDastElement,
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

    let pretextElement = flatDast.children
        .map((r) => (isAnnotatedElementRef(r) ? elements[r.id] : null))
        .find((r) => r?.name === "pretext");
    if (!pretextElement) {
        const id = elements.length;
        pretextElement = {
            type: "element",
            name: "pretext",
            children: flatDast.children,
            attributes: {},
            data: { id },
        } as FlatDastElement;
        elements.push(pretextElement);
        flatDast.children = [{ id, annotation: "original" }];
    }

    if (!pretextElement.children) {
        console.log(pretextElement);
    }
    // Ensure that a <book> or <article> tag is immediately inside the <pretext> tag
    // There may be a <docinfo> tag that is a sibling of the division tag.
    const hasDivisionTag = pretextElement.children.find(
        (r) =>
            isAnnotatedElementRef(r) &&
            (elements[r.id].name === "book" ||
                elements[r.id].name === "article"),
    );
    if (!hasDivisionTag) {
        const docinfoElementPos = pretextElement.children.findIndex(
            (r) =>
                isAnnotatedElementRef(r) && elements[r.id].name === "docinfo",
        );
        console.log({ docinfoElementPos });
        const siblings = pretextElement.children.slice(
            0,
            docinfoElementPos + 1,
        );
        const children = pretextElement.children.slice(docinfoElementPos + 1);

        const divisionElement = {
            type: "element",
            name: ensuredDivisionType,
            children,
            attributes: {},
            data: { id: elements.length },
        } as FlatDastElement;
        elements.push(divisionElement);

        pretextElement.children = siblings;
        pretextElement.children.push({
            id: divisionElement.data.id,
            annotation: "original",
        });
    }
}

function isAnnotatedElementRef(node: any): node is AnnotatedElementRef {
    return node?.id != null && node?.type == null;
}
