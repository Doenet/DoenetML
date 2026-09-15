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
    namespaceChainOf,
    deleteAssignNames,
    readAssignNames,
    setCompositeName,
} from "./assign-names/context";
import {
    isValidReferenceableName,
    makeIndexedPathPart,
} from "./assign-names/rename-registry";

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
export const upgradeCopyElements: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return (tree, file) => {
        visit(tree, (node, info) => {
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
            // Every `<copy>` needs its assigned name turned into a `name`, and it has to
            // happen here rather than in `upgradeCopySyntax` — that runs after the
            // references have been rewritten, too late to register anything.
            convertAssignNames(
                node,
                namespaceChainOf(info.parents, context),
                context,
                file,
            );

            const uriKey = findKey(node, "uri");
            if (!uriKey) {
                return;
            }
            const uri = toXml(node.attributes[uriKey].children).trim();
            if (!uri.toLowerCase().startsWith("doenet:")) {
                return;
            }

            const passedAttributes = Object.keys(node.attributes).filter(
                (key) => !COPY_OWN_ATTRIBUTES.has(key.toLowerCase()),
            );

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

            // Some of the copy's own attributes narrow *what* is copied. None of them
            // can be said on a `<module copy="doenet:...">`, and guessing would change
            // what the document shows, so the tag is left for the author instead.
            const narrowing = Object.keys(node.attributes).filter((key) =>
                COPY_NARROWING_ATTRIBUTES.has(key.toLowerCase()),
            );
            if (narrowing.length > 0) {
                file.message(
                    `<copy uri="${uri}"> could not be converted because it also sets ${narrowing.join(
                        ", ",
                    )}, which changes what it copies; v0.7 has no way to say that on the element that loads an external document. Convert it by hand.`,
                    {
                        place: node.position,
                        ruleId: "external-copy/narrowed",
                        source: "v06-to-v07",
                    },
                );
                return;
            }

            // The rest are v0.6 copy machinery that means nothing once the element is a
            // `<module>`. Leaving them in place would silently reinterpret them as the
            // module's own attributes, so drop them and say which.
            const dropped = Object.keys(node.attributes).filter((key) =>
                COPY_CONTROL_ATTRIBUTES.has(key.toLowerCase()),
            );
            for (const key of dropped) {
                delete node.attributes[key];
            }

            // Parameters passed to a v0.6 `<copy uri>` are a module's custom attributes.
            node.name = "module";
            renameAttrInPlace(node, uriKey, "copy");

            if (dropped.length > 0) {
                file.message(
                    `Dropped ${dropped.join(
                        ", ",
                    )} from <copy uri="${uri}">: they controlled how v0.6 copied, and a <module copy="doenet:..."> has no equivalent. Note that the result is an unlinked copy; use "extend" instead of "copy" if the original link mattered.`,
                    {
                        place: node.position,
                        ruleId: "external-copy/dropped-copy-controls",
                        source: "v06-to-v07",
                    },
                );
            }

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
 * Attributes that belong to the `<copy>` itself rather than to whatever it copies. Only
 * the others say anything about what the external document is, so only they count as
 * evidence that its target takes parameters.
 *
 * Taken from v0.6's `Copy.js` `createAttributesObject`, plus the ways of naming the
 * target and the copy. (v0.7's `<copy>` has a different set — `asList`, `copyInChildren`
 * and so on — but none of those can appear in the v0.6 documents this reads.)
 */
/**
 * The subset of {@link COPY_OWN_ATTRIBUTES} that changes *what* is copied — either by
 * selecting part of the target, or by naming a different target altogether. A
 * `<copy uri>` carrying one of these cannot become a `<module copy="doenet:...">` at all.
 */
const COPY_NARROWING_ATTRIBUTES = new Set([
    "componentindex",
    "createcomponentoftype",
    "numcomponents",
    "obtainpropfromcomposite",
    "prop",
    "propindex",
    "removeemptyarrayentries",
    "source",
    "sourceindex",
    "sourcesubnames",
    "sourcesubnamescomponentindex",
    "target",
    "tname",
]);

/**
 * The subset of {@link COPY_OWN_ATTRIBUTES} that only told v0.6 *how* to copy. These can
 * be dropped — with a note — because the converted element does not copy the v0.6 way.
 *
 * `assignNames` is not here: it has already become a `name` by this point. Neither is
 * `newNamespace`, which `removeNewNamespaceAttribute` deletes earlier, nor `name`, which
 * a `<module>` keeps.
 */
const COPY_CONTROL_ATTRIBUTES = new Set([
    "assignnamesskip",
    "assignnewnamespaces",
    "link",
    "sourceattributestoignore",
]);

const COPY_OWN_ATTRIBUTES = new Set([
    "assignnames",
    "assignnamesskip",
    "assignnewnamespaces",
    "componentindex",
    "createcomponentoftype",
    "link",
    "name",
    "newnamespace",
    "numcomponents",
    "obtainpropfromcomposite",
    "prop",
    "propindex",
    "removeemptyarrayentries",
    "source",
    "sourceattributestoignore",
    "sourceindex",
    "sourcesubnames",
    "sourcesubnamescomponentindex",
    "target",
    "tname",
    "uri",
]);

/**
 * Give a `<copy>` the name its references will be converted to.
 *
 * A single assigned name is the component's `name`. When the element already carries a
 * `name`, or when something else has taken the assigned one, the assigned name is an alias
 * and references to it are pointed at whatever the component ends up called, rather than
 * left dangling.
 *
 * More than one assigned name cannot be mapped. The names addressed the replacements of
 * the copied component, and how many of those there are depends on what was copied — for
 * an external document, on one this converter cannot even read. Those are reported and
 * left alone rather than guessed at.
 */
function convertAssignNames(
    node: DastElement,
    ancestorNames: string[],
    context: AssignNamesContext,
    file: VFile,
) {
    const assignNamesValue = readAssignNames(node);
    if (!assignNamesValue) {
        deleteAssignNames(node);
        return;
    }
    const origin = {
        elementName: node.name,
        position: node.position,
        ancestorNames,
    };
    const parsed = breakStringInPiecesBySpacesOrParens(assignNamesValue);
    const names =
        parsed.success && parsed.pieces.every((p) => typeof p === "string")
            ? (parsed.pieces as string[])
            : undefined;

    if (!names || names.length !== 1) {
        file.message(
            `assignNames="${assignNamesValue}" on <${node.name}> could not be converted: the names refer to the replacements of the copied component, and this converter cannot tell how many of those there are. References to those names need fixing by hand.`,
            {
                place: node.position,
                ruleId: "copy/unmapped-assign-names",
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

    // A name already carried by a real component is not ours to take, and references to
    // it were never about this copy. A name claimed by another `assignNames` is a
    // different matter: v0.6 namespaces allowed that, so this copy takes a name of its
    // own and the references reaching into *its* namespace are pointed at it.
    const nameBelongsToAnother =
        !isValidReferenceableName(assignedName) ||
        context.existingNames.has(assignedName);
    const nameIsTaken =
        nameBelongsToAnother || context.claimedNames.has(assignedName);

    if (existingName) {
        // The element keeps the name it already had, so an assigned name that differs is
        // simply another way of spelling it and references can be pointed at it — unless
        // something else is already called that, in which case pointing them here would
        // move references that were never about this copy.
        if (existingName !== assignedName && !nameBelongsToAnother) {
            context.registry.register(
                assignedName,
                [makeIndexedPathPart(existingName, [])],
                origin,
                file,
            );
        } else if (existingName !== assignedName) {
            reportNameAlreadyTaken(node, assignedName, file);
        }
        deleteAssignNames(node);
        setCompositeName(node, existingName);
        return;
    }

    if (nameIsTaken) {
        const generated = context.uniqueName("copy");
        if (nameBelongsToAnother) {
            // References to it were never about this copy, so they are left alone.
            reportNameAlreadyTaken(node, assignedName, file);
        } else {
            // Another `assignNames` holds the bare name, but this copy is somewhere else,
            // so references that reach into its namespace are pointed at it.
            context.registry.register(
                assignedName,
                [makeIndexedPathPart(generated, [])],
                origin,
                file,
            );
        }
        deleteAssignNames(node);
        setCompositeName(node, generated);
        return;
    }

    context.claimedNames.add(assignedName);
    // Claim it in the registry too, without a replacement: references to it already
    // resolve, but anything else assigning the same name must be told it is taken rather
    // than silently redirecting them.
    context.registry.register(assignedName, undefined, origin, file);
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

function reportNameAlreadyTaken(
    node: DastElement,
    assignedName: string,
    file: VFile,
) {
    file.message(
        `<${node.name}> assigns the name "${assignedName}", but something else in the document is already called that. References to "${assignedName}" were left pointing where they already pointed.`,
        {
            place: node.position,
            ruleId: "copy/name-already-taken",
            source: "v06-to-v07",
        },
    );
}

function findKey(node: DastElement, attrName: string): string | undefined {
    return Object.keys(node.attributes).find(
        (key) => key.toLowerCase() === attrName.toLowerCase(),
    );
}
