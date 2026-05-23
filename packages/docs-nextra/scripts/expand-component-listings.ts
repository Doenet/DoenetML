/**
 * Remark plugin that expands `<ComponentIndex/>` and
 * `<ComponentTable components={...}/>` MDX invocations into native markdown
 * tables (and, for the index, the preceding `## A`, `## F-G`, … section
 * headings) before MDX compiles.
 *
 * Why a remark plugin and not just a React component?
 *
 * Nextra's table styling and right-sidebar "On This Page" TOC both come from
 * the MDX AST. The theme styles markdown-derived `<table>` nodes (with the
 * specific HTML structure remark-gfm emits) and builds the TOC by scanning
 * `heading` nodes at compile time. A React component that renders `<table>`
 * and `<h2>` at runtime does neither — the styles miss and the headings
 * never reach the TOC. Substituting real `table` / `heading` mdast nodes
 * here makes the output indistinguishable from the hand-written tables the
 * page replaced.
 */
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import {
    Root as MdastRoot,
    Heading,
    Html,
    Link,
    InlineCode,
    PhrasingContent,
    RootContent,
    Table,
    TableCell,
    TableRow,
    Text,
} from "mdast";
import "mdast-util-mdx-jsx";
import type {
    MdxJsxFlowElement,
    MdxJsxAttribute,
    MdxJsxAttributeValueExpression,
} from "mdast-util-mdx-jsx";
import { doenetSchema } from "@doenet/static-assets/schema";

/**
 * One row in the rendered table. Mirrors the `Entry` shape used in the
 * React-side `component-listing.tsx` so the two stay in sync semantically;
 * the only difference is that this side emits mdast nodes instead of JSX.
 */
type Entry = {
    name: string;
    context?: string;
    docsSlug: string | null;
    summary: string;
};

type SchemaLike = {
    name: string;
    summary: string;
    docsSlug: string | null;
    displayName?: string;
    displayContext?: string;
};

/** Letter groupings matching the prior hand-written `componentIndex.mdx`. */
const LETTER_GROUPS: string[][] = [
    ["A"],
    ["B"],
    ["C"],
    ["D"],
    ["E"],
    ["F", "G"],
    ["H", "I", "J", "K", "L"],
    ["M"],
    ["N", "O"],
    ["P"],
    ["Q", "R"],
    ["S"],
    ["T"],
    ["U", "V", "W", "X", "Y", "Z"],
];

/**
 * Build the full pool of entries: every regular element plus every aliased
 * element. Deduplication is the renderer's responsibility — for the
 * alphabetical index we collapse on `(displayName, docsSlug)`, but for a
 * by-category table we render exactly what the .mdx asked for.
 */
function buildAllEntries(): Entry[] {
    const elements = (doenetSchema as { elements: SchemaLike[] }).elements;
    const aliased = (
        doenetSchema as { aliasedElements?: Record<string, SchemaLike> }
    ).aliasedElements;
    const all = [...elements, ...Object.values(aliased ?? {})];
    return all.map((el) => ({
        name: el.displayName ?? el.name,
        context: el.displayContext,
        docsSlug: el.docsSlug,
        summary: el.summary,
    }));
}

/**
 * Lookup map for `<ComponentTable/>`. Keys take the form `"name"` or
 * `"name|context"` so the .mdx author can write either `"alert"` or
 * `"row (in a matrix)"` in the `components` prop. The raw componentType
 * (e.g. `"matrixRow"`) is also kept as a fallback alias.
 */
function buildLookup(): Map<string, Entry> {
    const lookup = new Map<string, Entry>();
    const elements = (doenetSchema as { elements: SchemaLike[] }).elements;
    const aliased = (
        doenetSchema as { aliasedElements?: Record<string, SchemaLike> }
    ).aliasedElements;
    for (const el of [...elements, ...Object.values(aliased ?? {})]) {
        const tag = el.displayName ?? el.name;
        const key = el.displayContext ? `${tag}|${el.displayContext}` : tag;
        const entry: Entry = {
            name: tag,
            context: el.displayContext,
            docsSlug: el.docsSlug,
            summary: el.summary,
        };
        lookup.set(key, entry);
        if (!lookup.has(el.name)) {
            lookup.set(el.name, entry);
        }
    }
    return lookup;
}

const ALL_ENTRIES = buildAllEntries();
const ENTRIES_BY_KEY = buildLookup();

/** Parse `"row (in a matrix)"` → `{ tag: "row", context: "in a matrix" }`. */
function parseSpec(spec: string): { tag: string; context?: string } {
    const m = spec.match(/^(\S+)\s*\((.+)\)\s*$/);
    if (m) return { tag: m[1], context: m[2] };
    return { tag: spec };
}

/**
 * Resolve a single `components` entry against the schema. Unresolved specs
 * fall through to a "(not found in schema — …)" row so the issue surfaces
 * in the rendered page rather than being silently dropped.
 */
function resolveSpec(spec: string): Entry {
    const { tag, context } = parseSpec(spec);
    const key = context ? `${tag}|${context}` : tag;
    const found = ENTRIES_BY_KEY.get(key) ?? ENTRIES_BY_KEY.get(tag);
    if (!found) {
        return {
            name: tag,
            context,
            docsSlug: null,
            summary: `(not found in schema — fix the components prop entry "${spec}")`,
        };
    }
    return { ...found, context: context ?? found.context };
}

/**
 * Produce the phrasing children for a Component cell: `<tag>` wrapped in a
 * link when there's a doc page, optionally followed by the parenthetical
 * disambiguator. Returns one or two phrasing-content nodes.
 */
function makeComponentCellChildren(entry: Entry): PhrasingContent[] {
    const code: InlineCode = {
        type: "inlineCode",
        value: `<${entry.name}>`,
    };
    const tag: PhrasingContent = entry.docsSlug
        ? ({
              type: "link",
              url: entry.docsSlug,
              children: [code],
          } as Link)
        : code;
    if (!entry.context) return [tag];
    const suffix: Text = { type: "text", value: ` (${entry.context})` };
    return [tag, suffix];
}

/**
 * Build a markdown table node for a list of entries. The first row is the
 * header — remark-gfm marks the first row as the thead at parse/serialize
 * time, and the mdast `table` node follows the same convention.
 */
function makeTable(entries: Entry[]): Table {
    const header: TableRow = {
        type: "tableRow",
        children: [
            {
                type: "tableCell",
                children: [{ type: "text", value: "Component" }],
            } satisfies TableCell,
            {
                type: "tableCell",
                children: [{ type: "text", value: "Description" }],
            } satisfies TableCell,
        ],
    };
    const rows: TableRow[] = entries.map((e) => ({
        type: "tableRow",
        children: [
            {
                type: "tableCell",
                children: makeComponentCellChildren(e),
            } satisfies TableCell,
            {
                type: "tableCell",
                children: [{ type: "text", value: e.summary }],
            } satisfies TableCell,
        ],
    }));
    return {
        type: "table",
        align: [null, null],
        children: [header, ...rows],
    };
}

/**
 * Documented entries for the alphabetical index, deduped on
 * `(displayName, docsSlug)` and sorted. Built once per build invocation.
 */
function getDocumentedSorted(): Entry[] {
    const seen = new Set<string>();
    const documented: Entry[] = [];
    for (const e of ALL_ENTRIES) {
        if (e.docsSlug == null) continue;
        const key = `${e.name}|${e.docsSlug}`;
        if (seen.has(key)) continue;
        seen.add(key);
        documented.push(e);
    }
    documented.sort((a, b) => {
        const cmp = a.name.localeCompare(b.name);
        if (cmp !== 0) return cmp;
        return (a.context ?? "").localeCompare(b.context ?? "");
    });
    return documented;
}

/**
 * Expand a `<ComponentIndex/>` placeholder into a `## Letter` heading +
 * markdown table for each non-empty letter group.
 */
function expandComponentIndex(): RootContent[] {
    const documented = getDocumentedSorted();
    const nodes: RootContent[] = [];
    for (const group of LETTER_GROUPS) {
        const inGroup = documented.filter((e) =>
            group.includes(e.name[0].toUpperCase()),
        );
        if (inGroup.length === 0) continue;
        const label =
            group.length === 1
                ? group[0]
                : `${group[0]}-${group[group.length - 1]}`;
        const heading: Heading = {
            type: "heading",
            depth: 2,
            children: [{ type: "text", value: label }],
        };
        nodes.push(heading);
        nodes.push(makeTable(inGroup));
    }
    return nodes;
}

/**
 * Pull the string entries out of `components={["a","b",…]}`. The MDX
 * `components` attribute carries an estree ArrayExpression of string
 * literals; everything else (numbers, expressions, identifiers) is rejected
 * with a build-time message so silent mis-typings surface immediately.
 */
function readComponentsAttr(node: MdxJsxFlowElement): string[] | null {
    const attr = node.attributes.find(
        (a): a is MdxJsxAttribute =>
            a.type === "mdxJsxAttribute" && a.name === "components",
    );
    if (!attr) return null;
    const value = attr.value;
    if (
        !value ||
        typeof value === "string" ||
        (value as MdxJsxAttributeValueExpression).type !==
            "mdxJsxAttributeValueExpression"
    ) {
        return null;
    }
    const estree = (value as MdxJsxAttributeValueExpression).data?.estree as
        | { body: any[] }
        | undefined;
    if (!estree || !estree.body || estree.body.length === 0) return null;
    const expr = estree.body[0]?.expression;
    if (!expr || expr.type !== "ArrayExpression") return null;
    const out: string[] = [];
    for (const el of expr.elements) {
        if (!el || el.type !== "Literal" || typeof el.value !== "string") {
            // A non-string entry is a programmer error, but we keep going
            // and surface it in the rendered output via resolveSpec().
            continue;
        }
        out.push(el.value);
    }
    return out;
}

export const expandComponentListings: Plugin<void[], MdastRoot, MdastRoot> =
    function () {
        return (tree) => {
            const replacements: {
                parent: { children: RootContent[] };
                index: number;
                nodes: RootContent[];
            }[] = [];
            visit(tree, (node, index, parent) => {
                if (node.type !== "mdxJsxFlowElement") return;
                const flow = node as MdxJsxFlowElement;
                if (typeof index !== "number" || !parent) return;
                // `unist-util-visit` only knows that `parent.children` is
                // `Node[]`; inside an mdast tree they're always `RootContent`.
                const mdastParent = parent as { children: RootContent[] };
                if (flow.name === "ComponentIndex") {
                    replacements.push({
                        parent: mdastParent,
                        index,
                        nodes: expandComponentIndex(),
                    });
                } else if (flow.name === "ComponentTable") {
                    const specs = readComponentsAttr(flow);
                    if (!specs) return;
                    const entries = specs.map(resolveSpec);
                    replacements.push({
                        parent: mdastParent,
                        index,
                        nodes: [makeTable(entries)],
                    });
                }
            });
            // Apply replacements in reverse so earlier indices stay valid.
            replacements.sort((a, b) => b.index - a.index);
            for (const r of replacements) {
                r.parent.children.splice(r.index, 1, ...r.nodes);
            }
        };
    };
