import {
    DastElement,
    DastRoot,
    DastRootV6,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";
import { NamePieces, firstLeafName } from "./break-into-pieces";
import { RenameRegistry, isValidReferenceableName } from "./rename-registry";
import {
    UniqueNameFactory,
    collectExistingNames,
    createUniqueNameFactory,
} from "../utils";
import { renameAttrInPlace } from "../rename-attr-in-place";
import { VFile } from "vfile";
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
     * composites can carry the same `assignNames` token, and only one of them can end up
     * with the bare name.
     *
     * This pool is deliberately document-wide, which is stricter than v0.7 requires:
     * v0.7 resolves a name by searching outwards from the reference, so two components
     * with the same name are fine as long as they sit under different parents, and a
     * reference that could see both is the only thing that fails (`NonUniqueReferent` in
     * `ref_resolve`). Being strict costs a generated name in the handful of places where
     * an assigned name is already used elsewhere, and buys output that cannot be
     * ambiguous however the references are written. Relaxing it to "taken only by a
     * sibling" is a deliberate design change, not an oversight.
     */
    claimedNames: Set<string>;
    /**
     * The elements that carried `newNamespace`, recorded before that attribute is
     * removed. Only these were namespaces in v0.6, so only these are boundaries when
     * working out which of two same-named assignments a reference meant.
     *
     * The value is how the namespace appears in a reference path: its `name`, or — for a
     * namespace without one, such as the `<template newNamespace>` of a `<map>` — a
     * stand-in that no written path can match. An unnamed namespace cannot be reached
     * from outside, but it still keeps its contents apart from a sibling's.
     */
    namespaceElements: WeakMap<DastElement, string>;
    /**
     * For each name carried by a `name=` attribute, the v0.6 namespaces it sat in,
     * outermost first — the same shape `namespaceChainOf` produces.
     *
     * {@link existingNames} answers "can anything still be called this?", which after
     * flattening is a question about the whole document. This answers the different
     * question of whether a reference written somewhere was already about a real
     * component, which v0.6 resolved per namespace.
     */
    existingNameScopes: Map<string, string[][]>;
};

export function createAssignNamesContext(
    tree: DastRoot | DastRootV6,
): AssignNamesContext {
    const existingNames = collectExistingNames(tree);
    // This runs before `removeNewNamespaceAttribute`, which is the only chance to see
    // which elements were namespaces.
    const namespaceElements = new WeakMap<DastElement, string>();
    let unnamedCount = 0;
    visit(tree, (node) => {
        if (!isDastElement(node)) {
            return;
        }
        const newNamespaceKey = Object.keys(node.attributes).find(
            (key) => key.toLowerCase() === "newnamespace",
        );
        if (newNamespaceKey === undefined) {
            return;
        }
        // v0.6 read this as a primitive boolean (`createPrimitiveOfType: "boolean"` in
        // `BaseComponent.js`), and an attribute written with no value arrives as the
        // string `"true"`. Everything else had to be the literal `true` to count, so
        // `newNamespace="false"` created no namespace and must not become a boundary
        // here — descendants would be scoped to something that never existed, and an
        // outer reference to one of their assigned names would stop matching.
        const newNamespaceValue = toXml(
            node.attributes[newNamespaceKey].children,
        )
            .trim()
            .toLowerCase();
        if (newNamespaceValue !== "" && newNamespaceValue !== "true") {
            return;
        }
        const nameAttr = findAttribute(node, "name");
        const name = nameAttr ? toXml(nameAttr.children).trim() : "";
        // A null byte cannot appear in a name, so a stand-in built from one can never be
        // matched by a path an author wrote — which is right, because an unnamed
        // namespace is exactly the one nobody can write a path into.
        namespaceElements.set(node, name || `\u0000ns${++unnamedCount}`);
    });
    const context: AssignNamesContext = {
        registry: new RenameRegistry(existingNames),
        uniqueName: createUniqueNameFactory(tree),
        existingNames,
        claimedNames: new Set(),
        namespaceElements,
        existingNameScopes: new Map(),
    };
    // A second pass, because working out a name's namespace chain needs the map of
    // namespace elements the first pass just built.
    visit(tree, (node, info) => {
        if (!isDastElement(node)) {
            return;
        }
        const nameAttr = findAttribute(node, "name");
        const name = nameAttr ? toXml(nameAttr.children).trim() : "";
        if (!name) {
            return;
        }
        const scopes = context.existingNameScopes.get(name) ?? [];
        scopes.push(namespaceChainOf(info.parents as DastElement[], context));
        context.existingNameScopes.set(name, scopes);
    });
    return context;
}

/**
 * Whether a real component called `name` sits in the very namespace `ancestorNames`
 * names — the only place a bare reference written there would have found one instead of
 * an assigned name, since v0.6 let a nearer assignment shadow an outer component.
 */
export function nameTakenInScope(
    context: AssignNamesContext,
    name: string,
    ancestorNames: string[] | undefined,
): boolean {
    const scopes = context.existingNameScopes.get(name);
    if (!scopes) {
        return false;
    }
    const here = ancestorNames ?? [];
    return scopes.some(
        (scope) =>
            scope.length === here.length &&
            scope.every((segment, i) => segment === here[i]),
    );
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
    file?: VFile,
): string {
    const nameAttr = findAttribute(node, "name");
    const existingName = nameAttr ? toXml(nameAttr.children).trim() : "";
    // A name v0.7 cannot use is not one the references can be pointed at, and a caller
    // that rebuilds a name from this one (`<collect>` derives `collect_<name>`) would
    // reject it independently and the two would disagree.
    if (existingName && isValidReferenceableName(existingName)) {
        return existingName;
    }
    if (existingName) {
        file?.message(
            `<${node.name}> is called "${existingName}", which v0.7 cannot use as a name — it must start with a letter and hold only letters, digits, underscores and hyphens. A different name was used instead.`,
            {
                place: node.position,
                ruleId: "assign-names/invalid-name",
                source: "v06-to-v07",
            },
        );
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

/**
 * The `name`s of the elements enclosing a composite, outermost first.
 *
 * `visit` and `visitAll` both report parents nearest-first, which is the opposite of how
 * a reference path reads, so the chain is reversed here. Elements without a name are
 * skipped: they were never addressable, so a reference could not have mentioned them.
 */
export function namespaceChainOf(
    parents: DastElement[],
    context: AssignNamesContext,
): string[] {
    const chain: string[] = [];
    for (const parent of parents) {
        // A named element that was not a namespace could not appear in a reference path,
        // so it is not a boundary — `<graph name="g" newNamespace><p name="wrapper">` is
        // reached as `$(g/...)`, never `$(g/wrapper/...)`.
        const segment = context.namespaceElements.get(parent);
        if (segment !== undefined) {
            chain.push(segment);
        }
    }
    return chain.reverse();
}

/**
 * Record that `to` now stands where `from` stood, so it keeps its namespace.
 *
 * `<map>` over a `<sequence>` becomes a `<repeatForSequence>` built from the sequence
 * element, which throws away the `<template>` — and the template is what carried
 * `newNamespace`. Without this the names assigned inside it would look top-level.
 */
export function inheritNamespace(
    from: DastElement,
    to: DastElement,
    context: AssignNamesContext,
) {
    const segment = context.namespaceElements.get(from);
    if (segment !== undefined) {
        context.namespaceElements.set(to, segment);
    }
}
