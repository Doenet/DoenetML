import { Plugin } from "unified";
import {
    DastElement,
    DastRoot,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";
import { renameAttrInPlace } from "./rename-attr-in-place";

/**
 * v0.6 pulled in content from another document with `<copy uri="doenet:...">`; v0.7 does
 * it with a `copy` (or `extend`) attribute whose value starts with `doenet:`, resolved by
 * the host's `fetchExternalDoenetML` (see `expandExternalReferences` in `@doenet/parser`).
 *
 * The v0.7 mechanism requires the element to be the *same component type* as the single
 * top-level element of the fetched document. When the v0.6 `<copy uri>` passes extra
 * attributes, they are the `<customAttribute>`s of a `<module>` — that is the only thing
 * v0.6 let you parameterize this way — so such a copy becomes a `<module>`:
 *
 * ```xml
 *   <copy uri="doenet:cid=bafkre..." vmin="-1" var="u" assignNames="a" />
 * ```
 * becomes
 * ```xml
 *   <module copy="doenet:cid=bafkre..." vmin="-1" var="u" name="a" />
 * ```
 *
 * Two things this cannot do on its own, both of which are reported: the v0.6 identifier in
 * the URI (`cid=`/`activityId=`/`doenetId=`) is not a v0.7 content id, and a `<copy uri>`
 * that passes no attributes gives no clue what component type its target is.
 */
export const upgradeExternalCopy: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree, file) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name.toLowerCase() === "ref") {
                warnAboutExternalRef(node, file);
                return;
            }
            if (node.name.toLowerCase() !== "copy") {
                return;
            }
            const uriKey = findKey(node, "uri");
            if (!uriKey) {
                return;
            }
            const uri = toXml(node.attributes[uriKey].children).trim();
            if (!uri.toLowerCase().startsWith("doenet:")) {
                return;
            }

            const passedAttributes = Object.keys(node.attributes).filter(
                (key) =>
                    !["uri", "assignnames", "name"].includes(key.toLowerCase()),
            );

            // Whatever component type this ends up being, `assignNames` becomes `name`.
            const assignNamesKey = findKey(node, "assignNames");
            if (assignNamesKey && !findKey(node, "name")) {
                renameAttrInPlace(node, assignNamesKey, "name");
            } else if (assignNamesKey) {
                delete node.attributes[assignNamesKey];
            }

            if (passedAttributes.length === 0) {
                file.message(
                    `<copy uri="${uri}"> could not be converted: v0.7 loads external content with a "copy" attribute on an element of the same component type as the external document, and this copy passes no attributes to indicate what that type is. Replace it with, for example, <problem copy="doenet:<contentId>" /> once the target has been converted.`,
                    {
                        place: node.position,
                        ruleId: "external-copy/unknown-component-type",
                        source: "v06-to-v07",
                    },
                );
                return;
            }

            // Parameters passed to a v0.6 `<copy uri>` are a module's custom attributes.
            node.name = "module";
            renameAttrInPlace(node, uriKey, "copy");

            file.message(
                `Converted <copy uri="${uri}"> to <module copy="${uri}">, passing ${passedAttributes.join(", ")}. The identifier in the URI is a v0.6 one; replace it with the v0.7 content id of the converted module, and check that the target really is a <module>.`,
                {
                    place: node.position,
                    ruleId: "external-copy/needs-new-content-id",
                    source: "v06-to-v07",
                },
            );
        });
    };
};

/**
 * `<ref uri="doenet:...">` has already become `<ref to="doenet:...">` by this point, but
 * the identifier inside is still a v0.6 one.
 */
function warnAboutExternalRef(node: DastElement, file: any) {
    const toKey = findKey(node, "to");
    if (!toKey) {
        return;
    }
    const target = toXml(node.attributes[toKey].children).trim();
    if (!/^doenet:.*(activityId|doenetId|cid|pageId)=/i.test(target)) {
        return;
    }
    file.message(
        `<ref to="${target}"> points at a v0.6 activity; replace the identifier with the v0.7 content id (or a doenet.org URL) of the converted document.`,
        {
            place: node.position,
            ruleId: "external-ref/needs-new-content-id",
            source: "v06-to-v07",
        },
    );
}

function findKey(node: DastElement, attrName: string): string | undefined {
    return Object.keys(node.attributes).find(
        (key) => key.toLowerCase() === attrName.toLowerCase(),
    );
}
