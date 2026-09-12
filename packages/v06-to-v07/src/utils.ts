import {
    DastRoot,
    DastRootV6,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";

/**
 * Every value of a `name` attribute in the tree.
 */
export function collectExistingNames(tree: DastRoot | DastRootV6): Set<string> {
    const names = new Set<string>();
    visit(tree, (node) => {
        if (!isDastElement(node)) {
            return;
        }
        const nameAttr = Object.entries(node.attributes).find(
            ([name]) => name.toLowerCase() === "name",
        )?.[1];
        if (nameAttr) {
            const name = toXml(nameAttr.children).trim();
            if (name) {
                names.add(name);
            }
        }
    });
    return names;
}

/**
 * Every name the document uses, whether via `name` or via `assignNames`.
 */
export function collectAllNames(tree: DastRoot | DastRootV6): Set<string> {
    const names = collectExistingNames(tree);
    visit(tree, (node) => {
        if (!isDastElement(node)) {
            return;
        }
        const assignNamesAttr = Object.entries(node.attributes).find(
            ([name]) => name.toLowerCase() === "assignnames",
        )?.[1];
        if (!assignNamesAttr) {
            return;
        }
        const assignNames = toXml(assignNamesAttr.children).trim();
        for (const name of assignNames.split(/[\s()]+/)) {
            if (name) {
                names.add(name);
            }
        }
    });
    return names;
}

export type UniqueNameFactory = {
    /** Reserve and return a name based on `baseName`. */
    (baseName: string): string;
    /** Whether `name` is still unclaimed. */
    isFree(name: string): boolean;
};

/**
 * Hands out names that do not collide with anything already in the document, or with
 * anything it has handed out before.
 *
 * This must be created once per document and reused: `getUniqueName` rescans the tree on
 * every call, so once a plugin starts *deleting* `assignNames` attributes, two successive
 * calls can return the same string.
 */
export function createUniqueNameFactory(
    tree: DastRoot | DastRootV6,
): UniqueNameFactory {
    const used = collectAllNames(tree);

    const factory = ((baseName: string) => {
        let name = baseName;
        let i = 1;
        while (used.has(name)) {
            name = `${baseName}${i}`;
            i++;
        }
        used.add(name);
        return name;
    }) as UniqueNameFactory;

    factory.isFree = (name: string) => !used.has(name);

    return factory;
}

/**
 * Find a name that does not conflict with any existing element names. `baseName` is
 * used if available, otherwise a suffix is added to baseName until it is unique.
 *
 * Prefer {@link createUniqueNameFactory} when handing out more than one name, since this
 * function does not remember what it has already returned.
 */
export function getUniqueName(
    tree: DastRoot | DastRootV6,
    baseName: string,
): string {
    return createUniqueNameFactory(tree)(baseName);
}
