import { Plugin } from "unified";
import {
    DastElement,
    DastNodes,
    DastRoot,
    isDastElement,
    lezerToDast,
    toXml,
    visit,
} from "@doenet/parser";
import { VFile } from "vfile";
import { renameAttrInPlace } from "./rename-attr-in-place";
import {
    FetchExternalDoenetML,
    plainAttributeText,
    upgradeDoenetUri,
} from "./doenet-uri";
import { isV06True } from "./utils";
import { breakStringInPiecesBySpacesOrParens } from "./assign-names/break-into-pieces";
import {
    AssignNamesContext,
    namespaceChainOf,
    nameTakenInScope,
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
 * top-level element of the fetched document. Given a `fetchExternalDoenetML`, the
 * document is loaded and its root element says the type. Otherwise, when the v0.6
 * `<copy uri>` passes extra attributes, they are the `<customAttribute>`s of a `<module>`
 * — that is the only thing v0.6 let you parameterize this way — so such a copy becomes
 * a `<module>`:
 *
 * ```xml
 *   <copy uri="doenet:activityId=abc&amp;cid=bafkre..." vmin="-1" var="u" assignNames="a" />
 * ```
 * becomes
 * ```xml
 *   <module copy="doenet:abc" vmin="-1" var="u" name="a" />
 * ```
 *
 * The URI is rewritten to `doenet:<id>` by `upgradeDoenetUri`, assuming the id is the
 * document's doenet.org id. What this cannot do, and reports: a URI with no such id (a
 * bare `cid`, a `pageId`, a legacy id) is kept as written; a `<copy uri>` that passes no
 * attributes and whose document was not loaded gives no clue what component type its
 * target is; and a loaded document that is not a single component cannot be copied.
 */
export const upgradeCopyElements: Plugin<
    [AssignNamesContext, FetchExternalDoenetML | undefined],
    DastRoot,
    DastRoot
> = (context, fetchExternalDoenetML) => {
    return async (tree, file) => {
        const targets = fetchExternalDoenetML
            ? await lookUpExternalTargets(tree, fetchExternalDoenetML)
            : new Map<DastElement, ExternalTarget>();

        visit(tree, (node, info) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name.toLowerCase() === "ref") {
                upgradeExternalRef(node, file);
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
            const rawUri = plainAttributeText(node.attributes[uriKey]);
            const upgraded =
                rawUri === undefined ? undefined : upgradeDoenetUri(rawUri);
            const target = targets.get(node);

            const passedAttributes = Object.keys(node.attributes).filter(
                (key) => !COPY_OWN_ATTRIBUTES.has(key.toLowerCase()),
            );

            if (target?.kind === "unusable") {
                file.message(
                    `<copy uri="${uri}"> could not be converted: ${target.reason}`,
                    {
                        place: node.position,
                        ruleId: "external-copy/unusable-target",
                        source: "v06-to-v07",
                    },
                );
                return;
            }

            // The element has to be the type of the external document's root element.
            // When the document could be read, that says it; otherwise parameters
            // passed to a v0.6 `<copy uri>` are a module's custom attributes, the only
            // thing v0.6 let you parameterize this way.
            const elementType =
                target?.kind === "found"
                    ? target.rootType
                    : passedAttributes.length > 0
                      ? "module"
                      : undefined;

            if (elementType === undefined) {
                file.message(
                    `<copy uri="${uri}"> could not be converted: v0.7 loads external content with a "copy" attribute on an element of the same component type as the external document, and this copy passes no attributes to indicate what that type is.${target?.kind === "not-found" ? ` The document could not be loaded to find out: ${target.reason}` : ""} Replace it with, for example, <problem copy="doenet:<contentId>" /> once the target has been converted.`,
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

            // v0.7 has no `link`: an `extend` attribute is always linked and a `copy`
            // attribute never is, so the choice between them says it instead.
            //
            // With no `link` at all, v0.6 linked everything *except* a copy by cid/uri
            // and a copy of a module (`Copy.js`'s `link` state variable) — and this is
            // both — so the default here is the unlinked `copy`.
            const linkKey = findKey(node, "link");
            const targetTag =
                linkKey && isV06True(node.attributes[linkKey])
                    ? "extend"
                    : "copy";
            if (linkKey) {
                delete node.attributes[linkKey];
            }

            node.name = elementType;
            renameAttrInPlace(node, uriKey, targetTag);
            const newUri = upgraded?.uri ?? uri;
            if (upgraded) {
                node.attributes[targetTag].children = [
                    { type: "text", value: upgraded.uri },
                ];
            }

            if (dropped.length > 0) {
                file.message(
                    `Dropped ${dropped.join(
                        ", ",
                    )} from <copy uri="${uri}">: they controlled how v0.6 copied, and a <${elementType} ${targetTag}="doenet:..."> has no equivalent.`,
                    {
                        place: node.position,
                        ruleId: "external-copy/dropped-copy-controls",
                        source: "v06-to-v07",
                    },
                );
            }

            if (target?.kind === "found") {
                // The document was found and its root is what the element now says.
                return;
            }
            if (upgraded) {
                file.message(
                    `Converted <copy uri="${uri}"> to <module ${targetTag}="${newUri}">, passing ${passedAttributes.join(", ")}.${upgraded.dropped.length > 0 ? ` The v0.6 ${upgraded.dropped.join(", ")} was dropped.` : ""} This assumes the id is the one the document has on doenet.org, as it is for content copied from legacy.doenet.org, and that its root element is a <module>.${target?.kind === "not-found" ? ` The document could not be loaded to check: ${target.reason}` : ""}`,
                    {
                        place: node.position,
                        ruleId: "external-copy/assumed-content-id",
                        source: "v06-to-v07",
                    },
                );
                return;
            }
            file.message(
                `Converted <copy uri="${uri}"> to <module ${targetTag}="${uri}">, passing ${passedAttributes.join(", ")}. The identifier in the URI is a v0.6 one; replace it with the v0.7 content id of the converted module, and check that the target really is a <module>.`,
                {
                    place: node.position,
                    ruleId: "external-copy/needs-new-content-id",
                    source: "v06-to-v07",
                },
            );
        });
    };
};

type ExternalTarget =
    | { kind: "found"; rootType: string }
    | { kind: "not-found"; reason: string }
    | { kind: "unusable"; reason: string };

/**
 * Load the document each `<copy uri="doenet:...">` names, through the same
 * `fetchExternalDoenetML` the viewer will use, to learn the component type the converted
 * element must have.
 */
async function lookUpExternalTargets(
    tree: DastRoot,
    fetchExternalDoenetML: FetchExternalDoenetML,
): Promise<Map<DastElement, ExternalTarget>> {
    const lookups: Promise<[DastElement, ExternalTarget] | undefined>[] = [];
    visit(tree, (node) => {
        if (!isDastElement(node) || node.name.toLowerCase() !== "copy") {
            return;
        }
        const uriKey = findKey(node, "uri");
        const raw = uriKey && plainAttributeText(node.attributes[uriKey]);
        if (!raw) {
            return;
        }
        const uri = upgradeDoenetUri(raw)?.uri ?? raw.trim();
        // Only a `doenet:<id>` is something the viewer can fetch.
        if (!/^doenet:[A-Za-z0-9]+$/.test(uri)) {
            return;
        }
        lookups.push(
            fetchExternalDoenetML(uri).then(
                (doenetML) => [node, describeExternalRoot(doenetML, uri)],
                (e) => [node, { kind: "not-found", reason: String(e) }],
            ),
        );
    });
    const found = await Promise.all(lookups);
    return new Map(found.filter((entry) => entry !== undefined));
}

/**
 * What the viewer will accept from the document at `uri`: a single root element, or a
 * `<document>` holding a single element, whose type the copying element must share
 * (`findMatchingChild` in `@doenet/parser`'s `expand-external-references.ts`).
 */
function describeExternalRoot(doenetML: string, uri: string): ExternalTarget {
    const isBlank = (node: DastNodes) =>
        node.type === "text" && node.value.trim() === "";
    let roots = lezerToDast(doenetML).children.filter((node) => !isBlank(node));
    if (
        roots.length === 1 &&
        isDastElement(roots[0]) &&
        roots[0].name === "document"
    ) {
        const children = roots[0].children.filter((node) => !isBlank(node));
        if (children.length === 1 && isDastElement(children[0])) {
            roots = children;
        } else {
            return {
                kind: "unusable",
                reason: `the document at "${uri}" is a whole <document> rather than one component, and v0.7 can only load a single component from another document. Wrap its content in one element, such as a <module>, and copy that.`,
            };
        }
    }
    if (roots.length !== 1 || !isDastElement(roots[0])) {
        return {
            kind: "unusable",
            reason: `the document at "${uri}" does not consist of a single element, and v0.7 can only load a single component from another document. Wrap its content in one element, such as a <module>, and copy that.`,
        };
    }
    return { kind: "found", rootType: roots[0].name };
}

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
 * `link` is not here: v0.7 says the same thing by choosing between the `extend` and
 * `copy` attributes, so it is translated rather than dropped. Nor is `assignNames`, which
 * has already become a `name` by this point, or `newNamespace`, which
 * `removeNewNamespaceAttribute` deletes earlier, or `name`, which a `<module>` keeps.
 */
const COPY_CONTROL_ATTRIBUTES = new Set([
    "assignnamesskip",
    "assignnewnamespaces",
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
 * Give a copy — a `<copy>` element or an element carrying `copySource` — the name its
 * references will be converted to.
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
export function convertAssignNames(
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
        element: node,
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

    // A name v0.7 cannot spell is a different problem from a name someone else holds,
    // and saying so sends the author to the wrong fix.
    const nameIsUnusable = !isValidReferenceableName(assignedName);
    // A name already carried by a real component *in this copy's own namespace* is not
    // ours to take, and references to it were never about this copy. One in a different
    // namespace is a different matter, and so is a name claimed by another
    // `assignNames`: v0.6 allowed both, so this copy takes a name of its own and the
    // references reaching into *its* namespace are pointed at it.
    const nameBelongsToAnother =
        nameIsUnusable ||
        nameTakenInScope(context, assignedName, ancestorNames);
    // Whether the bare name is still *available* is a whole-document question, though:
    // once the namespaces are gone, only one component can carry it.
    const nameIsTaken =
        nameBelongsToAnother ||
        context.existingNames.has(assignedName) ||
        context.claimedNames.has(assignedName);

    // An existing name v0.7 cannot use is not one references can be pointed at, so it is
    // no more adoptable than an unusable assigned one. `chooseCompositeName` applies the
    // same rule on the path every other composite takes.
    if (existingName && !isValidReferenceableName(existingName)) {
        file.message(
            `<${node.name}> is called "${existingName}", which v0.7 cannot use as a name — it must start with a letter and hold only letters, digits, underscores and hyphens. A generated name was used instead and references to "${assignedName}" were left alone.`,
            {
                place: node.position,
                ruleId: "assign-names/invalid-name",
                source: "v06-to-v07",
            },
        );
        deleteAssignNames(node);
        setCompositeName(node, context.uniqueName("copy"));
        return;
    }

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
            reportUnusableName(node, assignedName, nameIsUnusable, file);
        }
        deleteAssignNames(node);
        setCompositeName(node, existingName);
        return;
    }

    if (nameIsTaken) {
        const generated = context.uniqueName("copy");
        if (nameBelongsToAnother) {
            // References to it were never about this copy, so they are left alone.
            reportUnusableName(node, assignedName, nameIsUnusable, file);
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
 * the URI is still in its v0.6 form. v0.7 only recognizes `doenet:<id>`.
 */
function upgradeExternalRef(node: DastElement, file: VFile) {
    const toKey = findKey(node, "to");
    if (!toKey) {
        return;
    }
    const value = plainAttributeText(node.attributes[toKey]);
    const upgraded = value === undefined ? undefined : upgradeDoenetUri(value);
    if (upgraded) {
        node.attributes[toKey].children = [
            { type: "text", value: upgraded.uri },
        ];
        file.message(
            `<ref> now links to "${upgraded.uri}"${upgraded.dropped.length > 0 ? `, without the v0.6 ${upgraded.dropped.join(", ")}` : ""}. This assumes the id is the one the document has on doenet.org, as it is for content copied from legacy.doenet.org.`,
            {
                place: node.position,
                ruleId: "external-ref/assumed-content-id",
                source: "v06-to-v07",
            },
        );
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

function reportUnusableName(
    node: DastElement,
    assignedName: string,
    nameIsUnusable: boolean,
    file: VFile,
) {
    if (nameIsUnusable) {
        file.message(
            `<${node.name}> assigns the name "${assignedName}", which v0.7 cannot use as a name — it must start with a letter and hold only letters, digits, underscores and hyphens. A generated name was used instead and references to "${assignedName}" were left alone.`,
            {
                place: node.position,
                ruleId: "assign-names/invalid-name",
                source: "v06-to-v07",
            },
        );
        return;
    }
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
