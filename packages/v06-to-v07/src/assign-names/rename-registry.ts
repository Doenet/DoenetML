import { DastElement, DastMacroPathPart } from "@doenet/parser";
import { VFile } from "vfile";

/**
 * A name is a legal v0.7 component name *and* can be referenced with a `$` macro.
 * (v0.7 also permits `-` in a `name`, but `$a-b` parses as a subtraction, so a name we
 * intend to generate references to must not contain one.)
 */
export const VALID_REFERENCEABLE_NAME = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export function isValidReferenceableName(name: string): boolean {
    return VALID_REFERENCEABLE_NAME.test(name);
}

export type RenameOrigin = {
    /** The element that carried the `assignNames` attribute; used in messages. */
    elementName: string;
    position?: DastElement["position"];
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
    private renames = new Map<string, RenameTarget>();
    private matched = new Set<string>();
    /** Names carried by a `name=` attribute somewhere in the document. */
    private existingNames: ReadonlySet<string>;

    constructor(existingNames: ReadonlySet<string> = new Set()) {
        this.existingNames = existingNames;
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
        const existing = this.renames.get(oldName);
        if (existing) {
            file.message(
                `The name "${oldName}" is assigned by both <${existing.origin.elementName}> and <${origin.elementName}>; references to it were converted as if they referred to the first.`,
                {
                    place: origin.position,
                    ruleId: "assign-names/duplicate-name",
                    source: "v06-to-v07",
                },
            );
            return;
        }
        if (this.existingNames.has(oldName)) {
            file.message(
                `The name "${oldName}" assigned by <${origin.elementName}> is also used as the "name" of another component; all references to "${oldName}" were converted to point at the <${origin.elementName}> replacement.`,
                {
                    place: origin.position,
                    ruleId: "assign-names/shadows-existing-name",
                    source: "v06-to-v07",
                },
            );
        }
        this.renames.set(oldName, { replacement, origin });
    }

    get(name: string): RenameTarget | undefined {
        const target = this.renames.get(name);
        if (target) {
            this.matched.add(name);
        }
        return target;
    }

    /** Whether `name` is registered *and* references to it need rewriting. */
    hasReplacement(name: string): boolean {
        return this.renames.get(name)?.replacement !== undefined;
    }

    get size(): number {
        return this.renames.size;
    }

    /** Registered names that were never referenced anywhere in the document. */
    unused(): string[] {
        return [...this.renames.keys()].filter((n) => !this.matched.has(n));
    }
}
