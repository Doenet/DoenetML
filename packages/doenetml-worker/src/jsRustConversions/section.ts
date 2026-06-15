import type { FlatDastElement } from "../CoreWorker";

/**
 * Conversion from javascript to rust for the section component.
 *
 * The rust `division` renderer draws the heading as
 * `{xrefLabel.label} {codeNumber}.` followed by the title child (`props.title`).
 * The JS core already computes the fully-formed heading prefix in `titlePrefix`
 * (applying all of its auto-name / auto-number rules) and the displayed `title`
 * text, so map those directly rather than recovering a label and number from
 * the title string.
 *
 * Note: `xrefLabel` is really meant for cross-references (an `<xref>` pointing
 * at this section); here we only borrow its `label` to render the heading.
 * Proper xref resolution from the JS core is not wired up — see issue for
 * follow-up.
 */
export function sectionJsToRust(
    props: Record<string, any>,
    element: FlatDastElement,
) {
    props.divisionType = element.name;
    props.divisionDepth = props.level;
    element.name = "division";

    const titleChildIdx =
        props.titleChildName != null ? Number(props.titleChildName) : undefined;
    const hasTitleChild =
        titleChildIdx !== undefined && Number.isInteger(titleChildIdx);

    // With a title child, the heading is the auto prefix (`titlePrefix`)
    // followed by the child; without one, `title` already is the whole heading.
    // Either way the JS core has already composed the number into that string,
    // so leave `codeNumber` empty.
    props.xrefLabel = {
        label: (hasTitleChild ? props.titlePrefix : props.title) ?? "",
        global_ident: props.sectionNumber ?? "",
        local_ident: props.sectionNumber ?? "",
        preferred_form: "Global",
    };
    props.codeNumber = "";

    if (hasTitleChild) {
        props.title = titleChildIdx;

        // The rust renderer draws the title child via `props.title`, so remove
        // it from the ordinary children to avoid rendering it twice. (Only
        // possible when this update carries children; a state-only update does
        // not replace the consumer's children, so skipping it is harmless.)
        const titleChild = element.children.findIndex(
            (child) => typeof child !== "string" && child.id === titleChildIdx,
        );
        if (titleChild !== -1) {
            element.children.splice(titleChild, 1);
        }
    } else {
        props.title = null;
    }
}
