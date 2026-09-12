import { DastElement, DastRoot, DastRootV6, toXml } from "@doenet/parser";
import { NamePieces, firstLeafName } from "./break-into-pieces";
import { RenameRegistry, isValidReferenceableName } from "./rename-registry";
import {
    UniqueNameFactory,
    collectExistingNames,
    createUniqueNameFactory,
} from "../utils";
import { renameAttrInPlace } from "../rename-attr-in-place";
import { findAttribute } from "./composite-info";

/**
 * Per-document state shared by every plugin that consumes `assignNames`, so that all of
 * them contribute to one registry and hand out names from one pool.
 */
export type AssignNamesContext = {
    registry: RenameRegistry;
    uniqueName: UniqueNameFactory;
    /** Names carried by a `name=` attribute, used to detect shadowing. */
    existingNames: Set<string>;
    /**
     * Assigned names that have already been promoted to some composite's `name`. Two
     * composites can carry the same `assignNames` token, and v0.7 will not accept the
     * duplicate `name` that would result.
     */
    claimedNames: Set<string>;
};

export function createAssignNamesContext(
    tree: DastRoot | DastRootV6,
): AssignNamesContext {
    const existingNames = collectExistingNames(tree);
    return {
        registry: new RenameRegistry(existingNames),
        uniqueName: createUniqueNameFactory(tree),
        existingNames,
        claimedNames: new Set(),
    };
}

/**
 * Decide what the v0.7 `name` of a composite carrying `assignNames` should be.
 *
 * Preference order:
 *  1. the `name` it already has;
 *  2. the first assigned name, so the author's own vocabulary survives
 *     (`assignNames="a b"` becomes `name="a"`, with `$a` -> `$a[1]`, `$b` -> `$a[2]`);
 *  3. a generated unique name, when the first assigned name is not a legal v0.7 name,
 *     already belongs to some other component, or has already been claimed this way.
 */
export function chooseCompositeName(
    node: DastElement,
    pieces: NamePieces,
    fallbackBase: string,
    context: AssignNamesContext,
): string {
    const nameAttr = findAttribute(node, "name");
    const existingName = nameAttr ? toXml(nameAttr.children).trim() : "";
    if (existingName) {
        return existingName;
    }

    const firstName = firstLeafName(pieces);
    if (
        firstName &&
        isValidReferenceableName(firstName) &&
        !context.existingNames.has(firstName) &&
        !context.claimedNames.has(firstName)
    ) {
        context.claimedNames.add(firstName);
        return firstName;
    }

    return context.uniqueName(fallbackBase);
}

/**
 * Give `node` the name `name` and drop its `assignNames`.
 *
 * When there is no existing `name` attribute, the `assignNames` attribute is renamed in
 * place so that attribute order (and therefore the shape of the converted source) is
 * preserved.
 */
export function setCompositeName(node: DastElement, name: string) {
    const nameAttr = findAttribute(node, "name");
    const oldKey = assignNamesKey(node);

    if (nameAttr) {
        // `chooseCompositeName` reads this attribute *trimmed*, and ignores it entirely
        // when it is empty, so `name=" p "` or `name=""` would leave the element carrying
        // something other than the name the references now point at. Write the name back
        // in exactly those cases. Leaving the attribute alone otherwise matters because
        // rendering it and storing the result as text would escape it a second time
        // (`name="a&amp;b"` becoming `name="a&amp;amp;b"`).
        if (toXml(nameAttr.children) !== name) {
            nameAttr.children = [{ type: "text", value: name }];
        }
        deleteAssignNames(node);
        return;
    }

    if (oldKey !== undefined) {
        renameAttrInPlace(node, oldKey, "name");
        node.attributes["name"].children = [{ type: "text", value: name }];
        return;
    }

    node.attributes["name"] = {
        type: "attribute",
        name: "name",
        children: [{ type: "text", value: name }],
    };
}

/**
 * The value of an element's `assignNames` attribute, or `undefined` if it has none.
 */
export function readAssignNames(node: DastElement): string | undefined {
    const key = assignNamesKey(node);
    if (key === undefined) {
        return undefined;
    }
    return toXml(node.attributes[key].children).trim();
}

/**
 * Drop an `assignNames` attribute. v0.7 ignores it, but leaving it in the output trips
 * schema validation and makes "did this document convert?" impossible to grep for.
 */
export function deleteAssignNames(node: DastElement) {
    const key = assignNamesKey(node);
    if (key !== undefined) {
        delete node.attributes[key];
    }
}

function assignNamesKey(node: DastElement): string | undefined {
    return Object.keys(node.attributes).find(
        (k) => k.toLowerCase() === "assignnames",
    );
}
