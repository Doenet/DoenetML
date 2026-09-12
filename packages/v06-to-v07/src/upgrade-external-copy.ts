import { Plugin } from "unified";
import {
    DastElement,
    DastRoot,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";
import { VFile } from "vfile";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { breakStringInPiecesBySpacesOrParens } from "./assign-names/break-into-pieces";
import {
    AssignNamesContext,
    deleteAssignNames,
    readAssignNames,
    setCompositeName,
} from "./assign-names/context";
import { makeIndexedPathPart } from "./assign-names/rename-registry";

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
export const upgradeExternalCopy: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
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

            convertAssignNames(node, uri, context, file);

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
 * Give an external copy the name its references will be converted to.
 *
 * Whatever component type the copy turns out to be, a single assigned name is that
 * component's `name`. When the element already carries a `name`, the assigned name is an
 * alias for it, so references are pointed at the `name` rather than left dangling.
 *
 * More than one assigned name cannot be mapped: the names addressed the replacements of a
 * document this converter cannot read, so there is nothing to say what index each one
 * became. Those references are reported and left alone rather than guessed at.
 */
function convertAssignNames(
    node: DastElement,
    uri: string,
    context: AssignNamesContext,
    file: VFile,
) {
    const assignNamesValue = readAssignNames(node);
    if (!assignNamesValue) {
        deleteAssignNames(node);
        return;
    }
    const origin = { elementName: node.name, position: node.position };
    const parsed = breakStringInPiecesBySpacesOrParens(assignNamesValue);
    const names =
        parsed.success && parsed.pieces.every((p) => typeof p === "string")
            ? (parsed.pieces as string[])
            : undefined;

    if (!names || names.length !== 1) {
        file.message(
            `assignNames="${assignNamesValue}" on <copy uri="${uri}"> could not be converted: the names refer to the replacements of an external document, and this converter cannot read it to work out which index each one became. References to those names need fixing by hand.`,
            {
                place: node.position,
                ruleId: "external-copy/unmapped-assign-names",
                source: "v06-to-v07",
            },
        );
        deleteAssignNames(node);
        return;
    }

    const [assignedName] = names;
    const existingName = toXml(
        node.attributes[findKey(node, "name") ?? ""]?.children ?? [],
    ).trim();

    if (existingName && existingName !== assignedName) {
        // The element keeps the `name` it already had, so the assigned name is just
        // another way of spelling it.
        context.registry.register(
            assignedName,
            [makeIndexedPathPart(existingName, [])],
            origin,
            file,
        );
        deleteAssignNames(node);
        return;
    }

    context.claimedNames.add(assignedName);
    setCompositeName(node, assignedName);
}

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
