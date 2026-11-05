import { DastElement, DastMacroPathPart } from "@doenet/parser";
import { VFile } from "vfile";

/**
 * A name is a legal v0.7 component name *and* can be referenced.
 *
 * A hyphen is allowed. `$a-b` would parse as a subtraction, but the parenthesized form
 * `$(a-b)` does not, and that is the only form v0.6 could reference such a name with
 * either. `toXml` re-adds the parentheses around any path part containing a hyphen, so
 * `$(a-b[1])` round-trips.
 */
export const VALID_REFERENCEABLE_NAME = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

export function isValidReferenceableName(name: string): boolean {
    return VALID_REFERENCEABLE_NAME.test(name);
}

export type RenameOrigin = {
    /** The element that carried the `assignNames` attribute; used in messages. */
    elementName: string;
    /**
     * The element that ends up carrying the new name. A reference written *on* that
     * element cannot mean the name it is about to take — `<copy source="../x0"
     * assignNames="x0">` reaches out of its namespace for the thing it copies — so
     * renames from this origin are not applied there.
     */
    element?: DastElement;
    position?: DastElement["position"];
    /**
     * The `name`s of the elements enclosing the composite, outermost first.
     *
     * v0.6 namespaces meant the same assigned name could appear more than once in a
     * document, and a reference said which it meant by writing the namespace in front of
     * it (`$(g2/a)`). Flattening the namespaces away loses that, so it is recorded here
     * and matched against the front of the reference path.
     */
    ancestorNames?: string[];
};

export type RenameTarget = {
    /**
     * The path parts that replace a matched path part. Always length 1 in practice, but
     * kept as an array so the splice site reads the same as the existing plugins.
     *
     * `undefined` means the name was claimed as a composite's v0.7 `name`, so references
     * to it already resolve and must be left exactly as the author wrote them. Such an
     * entry exists only so that a second composite assigning the same name is detected.
     */
    replacement?: DastMacroPathPart[];
    origin: RenameOrigin;
};

/**
 * Build the DAST for a path part with a chain of literal indices.
 *
 * `makeIndexedPathPart("s", [1, 2])` is the DAST for `s[1][2]`.
 */
export function makeIndexedPathPart(
    name: string,
    indices: number[],
): DastMacroPathPart {
    return {
        type: "pathPart",
        name,
        index: indices.map((i) => ({
            type: "index",
            value: [{ type: "text", value: `${i}` }],
        })),
    };
}

/**
 * Collects every `assignNames` token in a document and the v0.7 indexed path that
 * replaces it. A single registry is shared by all the plugins that consume `assignNames`
 * so that a reference is rewritten exactly once, no matter which plugin claimed the name.
 */
export class RenameRegistry {
    _renames = new Map<string, RenameTarget[]>();
    _matched = new Set<string>();
    /** Names carried by a `name=` attribute somewhere in the document. */
    _existingNames: ReadonlySet<string>;

    constructor(existingNames: ReadonlySet<string> = new Set()) {
        this._existingNames = existingNames;
    }

    /**
     * Register that `oldName` should be replaced by `replacement` wherever it appears in
     * a macro path. The first registration of a name wins; a later one warns.
     *
     * Pass `undefined` for `replacement` to claim the name without rewriting anything,
     * which is what a composite that simply took the assigned name as its own `name`
     * needs: references already resolve, but a later composite assigning the same name
     * must not silently redirect them.
     */
    register(
        oldName: string,
        replacement: DastMacroPathPart[] | undefined,
        origin: RenameOrigin,
        file: VFile,
    ) {
        if (!oldName) {
            return;
        }
        const existing = this._renames.get(oldName) ?? [];
        const scope = origin.ancestorNames ?? [];
        const sameScope = existing.find((target) =>
            sameScopeAs(target.origin.ancestorNames ?? [], scope),
        );
        if (sameScope) {
            file.message(
                `The name "${oldName}" is assigned by both <${sameScope.origin.elementName}> and <${origin.elementName}> in the same place; references to it were converted as if they referred to the first.`,
                {
                    place: origin.position,
                    ruleId: "assign-names/duplicate-name",
                    source: "v06-to-v07",
                },
            );
            return;
        }
        if (existing.length === 0 && this._existingNames.has(oldName)) {
            file.message(
                `The name "${oldName}" assigned by <${origin.elementName}> is also used as the "name" of another component; all references to "${oldName}" were converted to point at the <${origin.elementName}> replacement.`,
                {
                    place: origin.position,
                    ruleId: "assign-names/shadows-existing-name",
                    source: "v06-to-v07",
                },
            );
        }
        existing.push({ replacement, origin });
        this._renames.set(oldName, existing);
    }

    /**
     * The rename for `name`, chosen by which of them the reference is reaching into.
     *
     * `precedingNames` are the path parts written before it, so `$g2.a` looks up `a` with
     * `["g2"]`. The registration whose enclosing names are the longest match at the end of
     * that wins; one recorded with no enclosing names matches anything, which is what
     * keeps an unscoped document behaving exactly as before.
     */
    get(
        name: string,
        precedingNames: string[] = [],
        /** Skip renames that would point a reference at the element carrying it. */
        writtenOn?: DastElement,
    ): RenameTarget | undefined {
        const targets = this._renames.get(name);
        if (!targets || targets.length === 0) {
            return undefined;
        }
        let best: RenameTarget | undefined;
        let bestScore = -1;
        for (const target of targets) {
            if (writtenOn && target.origin.element === writtenOn) {
                continue;
            }
            const scope = target.origin.ancestorNames ?? [];
            if (!isSuffixOf(scope, precedingNames)) {
                continue;
            }
            if (scope.length > bestScore) {
                best = target;
                bestScore = scope.length;
            }
        }
        // Nothing matched, so the reference is not reaching into any of the namespaces
        // that assigned this name. Only a registration that was never scoped can speak
        // for it; guessing at one of the scoped ones would point it somewhere arbitrary.
        // A lookup that matched nothing is not a use, so `unused()` still reports the
        // name as never reached.
        if (best) {
            this._matched.add(name);
        }
        return best;
    }

    /** Whether `name` is registered *and* some registration rewrites references to it. */
    hasReplacement(name: string): boolean {
        return (this._renames.get(name) ?? []).some(
            (target) => target.replacement !== undefined,
        );
    }

    get size(): number {
        return this._renames.size;
    }

    /** Registered names that were never referenced anywhere in the document. */
    unused(): string[] {
        return [...this._renames.keys()].filter((n) => !this._matched.has(n));
    }
}

function sameScopeAs(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((name, i) => name === b[i]);
}

/** Whether `scope` is the tail of `path` — `["g2"]` is the tail of `["doc", "g2"]`. */
function isSuffixOf(scope: string[], path: string[]): boolean {
    if (scope.length > path.length) {
        return false;
    }
    const offset = path.length - scope.length;
    return scope.every((name, i) => name === path[offset + i]);
}
