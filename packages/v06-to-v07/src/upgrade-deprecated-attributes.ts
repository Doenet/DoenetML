import { Plugin } from "unified";
import {
    DastAttributeV6,
    DastElementV6,
    DastRootV6,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";
import { VFile } from "vfile";
import { reparseAttributeV6 } from "./reparse-attribute";
import { renameAttrInPlace } from "./rename-attr-in-place";

type AttrRule = {
    /** Only apply the rule when this returns true for the attribute's text value. */
    when?: (value: string, node: DastElementV6) => boolean;
    /** A short id so a batch report can group occurrences. */
    ruleId?: string;
} & (
    | { kind: "rename"; to: string }
    /** Rename, and prefix each whitespace-separated token with `$`. */
    | { kind: "renameToReferenceList"; to: string }
    /** Append this attribute's value to another attribute's value after a `.`. */
    | { kind: "mergeInto"; target: string }
    /** Move the attribute's value into a child element of the given name. */
    | { kind: "toChildElement"; elementName: string }
    /** Drop the attribute; v0.7 has no equivalent. */
    | { kind: "remove"; because: string }
    /** Keep the attribute but warn: it needs a human. */
    | { kind: "unsupported"; because: string }
);

type ElementRules = Record<string, AttrRule>;

/**
 * Rules that apply to every element. Keys are lowercased attribute names.
 */
const GLOBAL_RULES: ElementRules = {
    // v0.6 renamed `targets*` to `sources*`; v0.7 renamed them again to `references*`.
    sourcesareresponses: {
        kind: "renameToReferenceList",
        to: "referencesAreResponses",
    },
    targetsareresponses: {
        kind: "renameToReferenceList",
        to: "referencesAreResponses",
    },
    sourcesarefunctionsymbols: {
        kind: "renameToReferenceList",
        to: "referencesAreFunctionSymbols",
    },
    targetsarefunctionsymbols: {
        kind: "renameToReferenceList",
        to: "referencesAreFunctionSymbols",
    },
    triggerwithtargets: { kind: "renameToReferenceList", to: "triggerWith" },
    triggerwithtnames: { kind: "renameToReferenceList", to: "triggerWith" },
    updatewithtname: { kind: "rename", to: "updateWith" },
    updatewithtarget: { kind: "rename", to: "updateWith" },
    // `tname` was the pre-v0.6 spelling of the attribute naming what to act on. On
    // components that *copy*, it became `source`; everywhere else it became `target`.
    // The element-specific tables below override this for the copying components.
    tname: { kind: "rename", to: "target" },
};

/**
 * Rules keyed by lowercased element name, then lowercased attribute name.
 */
const ELEMENT_RULES: Record<string, ElementRules> = {
    copy: { tname: { kind: "rename", to: "source" } },
    collect: {
        tname: { kind: "rename", to: "source" },
        draggable: {
            kind: "remove",
            because: "<collect> does not take `draggable` in v0.7",
        },
    },
    extract: { tname: { kind: "rename", to: "source" } },
    updatevalue: {
        // `<updateValue target="x" prop="y">` is a single path in v0.7.
        prop: { kind: "mergeInto", target: "target" },
    },
    animatefromsequence: { prop: { kind: "mergeInto", target: "target" } },
    ref: {
        page: {
            kind: "remove",
            because:
                "v0.7 documents are not paginated, so <ref> has no `page`; link to the individual document instead",
            ruleId: "deprecated/ref-page",
        },
    },
    variantcontrol: { nvariants: { kind: "rename", to: "numVariants" } },
    option: {
        selectforvariantnames: { kind: "rename", to: "selectForVariants" },
    },
    graph: {
        xlabel: { kind: "toChildElement", elementName: "xLabel" },
        ylabel: { kind: "toChildElement", elementName: "yLabel" },
        height: {
            kind: "remove",
            because:
                "v0.7 graphs are sized with `size`, `width` and `aspectRatio`",
        },
    },
    image: {
        // v0.6 rendered `description` as the image's `alt` text. v0.7 carries that in a
        // `<shortDescription>` child, which the reference pages describe as required for
        // accessibility, so this must be converted rather than dropped.
        description: {
            kind: "toChildElement",
            elementName: "shortDescription",
        },
    },
    conditionalcontent: {
        maximumnumbertoshow: {
            kind: "remove",
            because: "v0.7 <conditionalContent> always shows one case",
        },
    },
    embed: {
        encodedgeogebracontent: {
            kind: "unsupported",
            because:
                "v0.7 has no <embed> element and no GeoGebra support; this content must be replaced by hand",
            ruleId: "no-v07-equivalent/embed-geogebra",
        },
    },
    point: {
        link: {
            kind: "remove",
            because: "`link` only means something alongside `copySource`",
            // `copySourceToExtendOrCopy` needs `link` when there is a `copySource`.
            when: (_value, node) =>
                !findAttrKey(node, "copySource") &&
                !findAttrKey(node, "source"),
        },
    },
    tabular: removeSides(),
    row: removeSides(),
    cell: removeSides(),
};

function removeSides(): ElementRules {
    const rule = {
        kind: "remove",
        because: "v0.7 tables do not take per-side border attributes",
    } as const;
    return { top: rule, bottom: rule, left: rule, right: rule };
}

/**
 * Apply the v0.6 -> v0.7 attribute renames and removals that are purely mechanical.
 *
 * This runs before `ensureDollarBeforeNamesOnSpecificAttributes` so that reference lists
 * such as `sourcesAreResponses="a b"` are dollar-prefixed token by token
 * (`referencesAreResponses="$a $b"`) rather than being wrapped as a single `$(a b)`.
 */
export const upgradeDeprecatedAttributes: Plugin<
    [],
    DastRootV6,
    DastRootV6
> = () => {
    return (tree, file) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            const elm = node as DastElementV6;
            const rules = {
                ...GLOBAL_RULES,
                ...(ELEMENT_RULES[elm.name.toLowerCase()] || {}),
            };
            // Snapshot the keys: the rules mutate `elm.attributes`. `mergeInto` finds its
            // target attribute by name, so it has to run after the renames that produce
            // that name — `<updateValue prop="value" tName="x">` must become
            // `target="$x.value"` however the two attributes were ordered in the source.
            const keys = Object.keys(elm.attributes);
            const isMerge = (key: string) =>
                rules[key.toLowerCase()]?.kind === "mergeInto";
            for (const key of [
                ...keys.filter((k) => !isMerge(k)),
                ...keys.filter(isMerge),
            ]) {
                const rule = rules[key.toLowerCase()];
                if (!rule) {
                    continue;
                }
                const attr = elm.attributes[key];
                if (!attr) {
                    continue;
                }
                const value = toXml(attr.children).trim();
                if (rule.when && !rule.when(value, elm)) {
                    continue;
                }
                applyRule(elm, key, attr, value, rule, file);
            }
        });
    };
};

/** How many children each element has had prepended, so they stay in attribute order. */
const prependedChildCount = new WeakMap<DastElementV6, number>();

function applyRule(
    elm: DastElementV6,
    key: string,
    attr: DastAttributeV6,
    value: string,
    rule: AttrRule,
    file: VFile,
) {
    switch (rule.kind) {
        case "rename": {
            renameAttrInPlace(elm as any, key, rule.to);
            return;
        }
        case "renameToReferenceList": {
            renameAttrInPlace(elm as any, key, rule.to);
            const dollared = value
                .split(/\s+/)
                .filter((t) => t)
                .map(referenceTo)
                .join(" ");
            elm.attributes[rule.to].children = reparseAttributeV6(dollared);
            return;
        }
        case "mergeInto": {
            const targetKey = findAttrKey(elm, rule.target);
            if (!targetKey || !value) {
                // Nothing to merge into; leave the attribute for a human to look at.
                return;
            }
            const targetValue = toXml(
                elm.attributes[targetKey].children,
            ).trim();
            elm.attributes[targetKey].children = reparseAttributeV6(
                `${targetValue}.${value}`,
            );
            delete elm.attributes[key];
            return;
        }
        case "toChildElement": {
            if (!value) {
                // An empty value carries no information, and an empty
                // `<shortDescription>` is how v0.7 marks an image decorative.
                delete elm.attributes[key];
                return;
            }
            const child: DastElementV6 = {
                type: "element",
                name: rule.elementName,
                attributes: {},
                children: attr.children as DastElementV6["children"],
                position: attr.position,
            };
            const alreadyPrepended = prependedChildCount.get(elm) || 0;
            elm.children.splice(alreadyPrepended, 0, child);
            prependedChildCount.set(elm, alreadyPrepended + 1);
            delete elm.attributes[key];
            return;
        }
        case "remove": {
            delete elm.attributes[key];
            file.message(
                `Removed ${key}="${value}" from <${elm.name}>: ${rule.because}.`,
                {
                    place: elm.position,
                    ruleId: rule.ruleId || `deprecated/${key.toLowerCase()}`,
                    source: "v06-to-v07",
                },
            );
            return;
        }
        case "unsupported": {
            file.message(
                `<${elm.name} ${key}="..."> was left unchanged: ${rule.because}.`,
                {
                    place: elm.position,
                    ruleId:
                        rule.ruleId || `no-v07-equivalent/${key.toLowerCase()}`,
                    source: "v06-to-v07",
                },
            );
            return;
        }
    }
}

function findAttrKey(elm: DastElementV6, attrName: string): string | undefined {
    return Object.keys(elm.attributes).find(
        (key) => key.toLowerCase() === attrName.toLowerCase(),
    );
}

/**
 * Write `token` as a v0.6 reference.
 *
 * A bare `$` only carries a plain identifier: `$a-b` is a subtraction and `$g/a` is a
 * reference to `g` followed by the text `/a`. Anything else has to go inside `$(...)`,
 * which is also where a namespace path was always written. The serializer drops the
 * parentheses again for names that do not need them.
 */
function referenceTo(token: string): string {
    if (token.startsWith("$(")) {
        // Already in the form that can carry anything.
        return token;
    }
    const name = token.startsWith("$") ? token.slice(1) : token;
    return /^[a-zA-Z0-9_]+$/.test(name) ? `$${name}` : `$(${name})`;
}
