import {
    DastElement,
    DastElementContent,
    isDastElement,
    toXml,
} from "@doenet/parser";
import { VFile } from "vfile";
import { PositionMap } from "./register-assign-names";

export type CompositeSpec = {
    /** Canonical v0.7 spelling, used for generated names and messages. */
    name: string;
    /**
     * How to tell whether the composite produces exactly one replacement, which is what
     * makes the `assignNames="a"` -> `name="a"` shortcut safe.
     */
    count:
        | { kind: "always-one" }
        | { kind: "attr"; attr: string }
        | { kind: "unknown" };
    /**
     * The child element that is a transparent wrapper around a group of replacements.
     * v0.7 flattens these, so names inside them sit one index deeper.
     */
    grouping?: { childName: string; alsoMatch?: string[] };
    /** The element itself has no v0.7 equivalent; warn while still fixing references. */
    noV07Equivalent?: boolean;
};

/**
 * The v0.6 composites that accept `assignNames` and are not already owned by another
 * plugin. `copy`, `collect`, `map` and `customAttribute` are deliberately absent: they are
 * handled by `copySourceToExtendOrCopy`/`upgradeCopySyntax`, `upgradeCollectElement`,
 * `upgradeMapElement` and `upgradeModuleElement` respectively.
 */
export const COMPOSITES: Record<string, CompositeSpec> = {
    select: {
        name: "select",
        count: { kind: "attr", attr: "numToSelect" },
        grouping: { childName: "option" },
    },
    selectfromsequence: {
        name: "selectFromSequence",
        count: { kind: "attr", attr: "numToSelect" },
    },
    selectrandomnumbers: {
        name: "selectRandomNumbers",
        count: { kind: "attr", attr: "numToSelect" },
    },
    samplerandomnumbers: {
        name: "sampleRandomNumbers",
        count: { kind: "attr", attr: "numSamples" },
    },
    selectprimenumbers: {
        name: "selectPrimeNumbers",
        count: { kind: "attr", attr: "numToSelect" },
    },
    sampleprimenumbers: {
        name: "samplePrimeNumbers",
        count: { kind: "attr", attr: "numSamples" },
    },
    conditionalcontent: {
        name: "conditionalContent",
        count: { kind: "always-one" },
        grouping: { childName: "case", alsoMatch: ["else"] },
    },
    sort: { name: "sort", count: { kind: "unknown" } },
    shuffle: { name: "shuffle", count: { kind: "unknown" } },
    group: { name: "group", count: { kind: "unknown" } },
    sequence: { name: "sequence", count: { kind: "unknown" } },
    substitute: { name: "substitute", count: { kind: "unknown" } },
    split: { name: "split", count: { kind: "unknown" } },
    intersection: { name: "intersection", count: { kind: "unknown" } },
    extract: {
        name: "extract",
        count: { kind: "unknown" },
        noV07Equivalent: true,
    },
};

export function lookupComposite(node: DastElement): CompositeSpec | undefined {
    return COMPOSITES[node.name.toLowerCase()];
}

/**
 * Whether the composite provably produces a single replacement. When it does, a bare
 * `$name` reference auto-flattens to that replacement, so `assignNames="a"` can simply
 * become `name="a"` with no reference rewriting at all.
 */
export function producesSingleReplacement(
    node: DastElement,
    spec: CompositeSpec,
): boolean {
    if (spec.count.kind === "always-one") {
        return true;
    }
    if (spec.count.kind === "unknown") {
        return false;
    }
    const attr = findAttribute(node, spec.count.attr);
    if (!attr) {
        // `numToSelect`/`numSamples` default to 1
        return true;
    }
    const raw = toXml(attr.children).trim();
    // A non-literal value (e.g. `$n`) could be anything, so don't take the shortcut.
    return raw === "" || raw === "1";
}

export function findAttribute(node: DastElement, attrName: string) {
    return Object.entries(node.attributes).find(
        ([name]) => name.toLowerCase() === attrName.toLowerCase(),
    )?.[1];
}

/**
 * Build a {@link PositionMap} accounting for the fact that v0.6 skipped bare text when
 * handing out `assignNames`, while v0.7's `[i]` counts every replacement.
 *
 * Only the level *inside* a transparent `<case>`/`<option>` wrapper can be affected, since
 * that is the only level whose members are authored children rather than generated
 * replacements. Returns `undefined` (meaning "identity") when no branch mixes bare text
 * with components, which is the overwhelmingly common case.
 */
export function makePositionMap(
    node: DastElement,
    spec: CompositeSpec,
    file: VFile,
): PositionMap | undefined {
    if (!spec.grouping) {
        return undefined;
    }
    const names = [
        spec.grouping.childName,
        ...(spec.grouping.alsoMatch || []),
    ].map((n) => n.toLowerCase());
    const branches = node.children.filter(
        (child): child is DastElement =>
            isDastElement(child) && names.includes(child.name.toLowerCase()),
    );
    if (branches.length === 0) {
        return undefined;
    }

    const maps = branches.map((branch) => branchPositionMap(branch.children));
    const first = maps[0];
    if (maps.every((m) => isIdentity(m))) {
        return undefined;
    }
    if (!maps.every((m) => sameMap(m, first))) {
        file.message(
            `The branches of <${node.name}> mix plain text with components differently, so the positions that assignNames referred to cannot be determined; the first branch was used.`,
            {
                place: node.position,
                ruleId: "assign-names/branch-index-skew",
                source: "v06-to-v07",
            },
        );
    }
    file.message(
        `<${node.name}> has a branch that mixes plain text with components. v0.6 skipped the text when assigning names but v0.7 counts it, so the converted indices are a best guess and should be checked.`,
        {
            place: node.position,
            ruleId: "assign-names/primitive-skew",
            source: "v06-to-v07",
        },
    );

    const insideGroupingDepth = 2;
    return (depth, ordinal) => {
        if (depth !== insideGroupingDepth) {
            return ordinal;
        }
        return first[ordinal - 1] ?? ordinal;
    };
}

/**
 * `result[k]` is the v0.7 position of the `(k+1)`-th non-text child.
 */
function branchPositionMap(children: DastElementContent[]): number[] {
    const result: number[] = [];
    let position = 0;
    for (const child of children) {
        if (child.type === "text") {
            if (child.value.trim() === "") {
                // Whitespace between components is dropped, not a replacement.
                continue;
            }
            position++;
            continue;
        }
        if (child.type === "comment" || child.type === "instruction") {
            continue;
        }
        position++;
        result.push(position);
    }
    return result;
}

function isIdentity(map: number[]): boolean {
    return map.every((v, i) => v === i + 1);
}

function sameMap(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}
