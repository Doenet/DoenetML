import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { computeOptimizedSchema } from "./compute-optimized-schema";
import { parseModule, Program as EstreeProgram } from "esprima";
import { Heading, Root as MdastRoot } from "mdast";
import GithubSlugger from "github-slugger";
import * as fs from "node:fs";
import * as path from "node:path";
// Importing this automatically imports all the types from `mdast-util-mdx-jsx`.
import "mdast-util-mdx-jsx";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

type OptimizedInfo = ReturnType<typeof computeOptimizedSchema>[string];

/**
 * A worked-example heading parsed from the page, e.g. `### Attribute Example:
 * boxed` or `### Property Example: width, height`. `slug` is the anchor id
 * Nextra will assign (see `collectExampleHeadings`); `names` are the raw,
 * comma-split tokens after the colon.
 */
type ExampleHeading = {
    slug: string;
    kind: "attribute" | "property";
    names: string[];
};

/** An example heading resolved to a concrete link target (same-page `#slug`
 * or cross-page `/reference/<page>#slug`). */
type ExampleRef = {
    href: string;
    kind: "attribute" | "property";
    names: string[];
};

// Mirror of Nextra's own heading-slug logic so the anchors we link to match
// the ids it assigns. Nextra skips headings whose parent is a tab.
const SKIP_FOR_PARENT_NAMES = new Set(["Tab", "Tabs.Tab"]);

type ExampleKind = "attribute" | "property";

// Worked examples appear under one of two heading conventions:
//   1. A typed item heading that names its own kind, e.g.
//      "### Attribute Example: functionSymbols" (used on the math pages).
//   2. A bare "### Example: <name>" item beneath a "## Attribute Examples" or
//      "## Property Examples" section heading (used on the answer pages),
//      where the section supplies the kind.
const SECTION_HEADING_RE = /^(attribute|property) examples?$/i;
const TYPED_EXAMPLE_RE = /^(attribute|property) example:\s*(.+)$/i;
const BARE_EXAMPLE_RE = /^examples?:\s*(.+)$/i;

/** The example-section kind a heading establishes (e.g. "Attribute Examples"),
 * or null when the heading is not an example-section heading. */
function exampleSectionKind(text: string): ExampleKind | null {
    const match = SECTION_HEADING_RE.exec(text.trim());
    return match ? (match[1].toLowerCase() as ExampleKind) : null;
}

/** Classify a heading as a worked-example item, using `sectionKind` (the
 * enclosing example section) for the bare "Example: <name>" form. Returns null
 * for headings that are not example items. */
function classifyExampleHeading(
    text: string,
    sectionKind: ExampleKind | null,
): { kind: ExampleKind; names: string[] } | null {
    const trimmed = text.trim();
    const typed = TYPED_EXAMPLE_RE.exec(trimmed);
    if (typed) {
        return {
            kind: typed[1].toLowerCase() as ExampleKind,
            names: splitExampleNames(typed[2]),
        };
    }
    const bare = BARE_EXAMPLE_RE.exec(trimmed);
    if (bare && sectionKind) {
        return { kind: sectionKind, names: splitExampleNames(bare[1]) };
    }
    return null;
}

/** Split the names listed after an example heading's colon. A heading may
 * cover several attributes/properties separated by `,` or `/` (e.g.
 * `displayDigits/displayDecimals`, `numRows/ numColumns`); names are
 * identifiers, so `/` is always a separator, never part of a name. */
function splitExampleNames(text: string): string[] {
    return text
        .split(/[,/]/)
        .map((name) => name.trim())
        .filter(Boolean);
}

/** Flatten a heading node's text content (matches Nextra's `getFlattenedValue`). */
function getFlattenedValue(node: any): string {
    return (node.children ?? [])
        .map((child: any) =>
            "children" in child
                ? getFlattenedValue(child)
                : "value" in child
                  ? child.value
                  : "",
        )
        .join("");
}

/**
 * Walk the page's headings in document order, advancing one stateful
 * `github-slugger` exactly as Nextra's `remark-headings` does, so the slugs we
 * compute for example headings match the anchor ids Nextra emits (including
 * its `-1`/`-2` dedup suffixes). Only headings of depth ≥ 2 are slugged
 * (Nextra returns early for the page `# h1`).
 */
function collectExampleHeadings(tree: MdastRoot): ExampleHeading[] {
    const slugger = new GithubSlugger();
    const found: ExampleHeading[] = [];
    let sectionKind: ExampleKind | null = null;
    visit(tree, "heading", (node: any, _index, parent: any) => {
        if (node.depth === 1) {
            return;
        }
        if (parent && SKIP_FOR_PARENT_NAMES.has(parent.name)) {
            return;
        }
        const value = getFlattenedValue(node);
        // Advance the slugger for every heading so dedup counters stay in sync,
        // even for headings that are not examples.
        const slug = slugger.slug(value);
        // A top-level heading opens (or, when not an example section, closes)
        // the example-section context that bare "Example: x" items inherit.
        if (node.depth === 2) {
            sectionKind = exampleSectionKind(value);
        }
        const example = classifyExampleHeading(value, sectionKind);
        if (example) {
            found.push({ slug, kind: example.kind, names: example.names });
        }
    });
    return found;
}

/**
 * Multi-page references (e.g. `math` + `math2`, `answer1`…`answer4`) spread a
 * component's worked examples across several pages, while the attribute/property
 * listing may live on only one of them. To link a listing to every example of
 * its component, we index examples across ALL reference pages, keyed by the
 * component each page documents.
 *
 * The component is read from each page's `# <tag>` H1 — every reference page
 * (including continuation pages with no display tag) declares it there — so no
 * extra per-page wiring is needed to associate the pages of one reference.
 *
 * Cached for the process: like the schema, the index is built once. Editing an
 * example heading on another page requires restarting the dev server to update
 * cross-page links (same constraint as schema changes).
 */
let crossPageExampleIndexCache: Map<string, ExampleRef[]> | null = null;

/** Resolve the `pages/reference` directory from the file currently being
 * processed, or `null` when the file is not a reference page. */
function getReferenceDir(file: { path?: string; history?: string[] }) {
    const filePath = file.path ?? file.history?.[0];
    if (!filePath) {
        return null;
    }
    const dir = path.dirname(filePath);
    return path.basename(dir) === "reference" ? dir : null;
}

/**
 * Scan a reference page's raw markdown for the component it documents (from the
 * `# <tag>` H1) and its example headings, advancing one `github-slugger` over
 * every depth-≥2 heading in document order to match Nextra's anchor ids.
 * Fenced code blocks are skipped so DoenetML examples containing `#` are not
 * mistaken for headings.
 */
function scanRawReferencePage(content: string): {
    component: string | null;
    examples: ExampleHeading[];
} {
    const slugger = new GithubSlugger();
    let component: string | null = null;
    const examples: ExampleHeading[] = [];
    let fenceMarker: string | null = null;
    let sectionKind: ExampleKind | null = null;

    for (const line of content.split(/\r?\n/)) {
        const fence = line.match(/^(`{3,}|~{3,})/);
        if (fence) {
            const marker = fence[1][0];
            if (fenceMarker === null) {
                fenceMarker = marker;
            } else if (marker === fenceMarker) {
                fenceMarker = null;
            }
            continue;
        }
        if (fenceMarker !== null) {
            continue;
        }
        const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
        if (!heading) {
            continue;
        }
        const depth = heading[1].length;
        const text = heading[2];
        if (depth === 1) {
            // Nextra returns before slugging the H1; read the component tag.
            const tag = text.match(/<\s*([A-Za-z0-9_]+)/);
            if (tag && !component) {
                component = tag[1];
            }
            continue;
        }
        const slug = slugger.slug(text);
        if (depth === 2) {
            sectionKind = exampleSectionKind(text);
        }
        const example = classifyExampleHeading(text, sectionKind);
        if (example) {
            examples.push({
                slug,
                kind: example.kind,
                names: example.names,
            });
        }
    }
    return { component, examples };
}

/** Build (and cache) the component → cross-page example links index by
 * scanning every reference page on disk. Hrefs are absolute
 * (`/reference/<page>#<slug>`) so they resolve from any other page. */
function getCrossPageExampleIndex(refDir: string): Map<string, ExampleRef[]> {
    if (crossPageExampleIndexCache) {
        return crossPageExampleIndexCache;
    }
    const index = new Map<string, ExampleRef[]>();
    let fileNames: string[];
    try {
        fileNames = fs.readdirSync(refDir);
    } catch {
        return index;
    }
    for (const fileName of fileNames) {
        if (!fileName.endsWith(".mdx") || fileName.startsWith("_")) {
            continue;
        }
        let content: string;
        try {
            content = fs.readFileSync(path.join(refDir, fileName), "utf8");
        } catch {
            continue;
        }
        const { component, examples } = scanRawReferencePage(content);
        if (!component || examples.length === 0) {
            continue;
        }
        const route = `/reference/${fileName.slice(0, -".mdx".length)}`;
        const list = index.get(component) ?? [];
        for (const example of examples) {
            list.push({
                href: `${route}#${example.slug}`,
                kind: example.kind,
                names: example.names,
            });
        }
        index.set(component, list);
    }
    crossPageExampleIndexCache = index;
    return index;
}

export const autoInsertAttrPropDescriptions: Plugin<
    void[],
    MdastRoot,
    MdastRoot
> = function () {
    const optimizedSchema = computeOptimizedSchema();
    return (tree, file) => {
        file.data.extraSearchData = {};

        // Collected up front, before we splice in the "Attributes and
        // Properties" heading below: that heading's slug never collides with
        // an example heading's, so its absence here does not perturb the
        // example slugs. The current page's examples come from this precise
        // mdast scan (exact anchors); other pages' come from the disk index.
        const currentRoute = `/reference/${file.stem ?? ""}`;
        const samePageExamples: ExampleRef[] = collectExampleHeadings(tree).map(
            (example) => ({
                href: `#${example.slug}`,
                kind: example.kind,
                names: example.names,
            }),
        );
        const refDir = getReferenceDir(file);
        const crossPageIndex = refDir
            ? getCrossPageExampleIndex(refDir)
            : new Map<string, ExampleRef[]>();

        visit(tree, (node, index, parent) => {
            if (node?.type !== "mdxJsxFlowElement") {
                return;
            }
            if (
                node.name !== "AttrDisplay" &&
                node.name !== "PropDisplay" &&
                node.name !== "ComponentDisplay" &&
                node.name !== "AttrPropDisplay"
            ) {
                return;
            }
            const nameAttr = node.attributes.find(
                (attr) =>
                    attr.type === "mdxJsxAttribute" && attr.name === "name",
            );
            const name = String(nameAttr?.value);
            const info = optimizedSchema[name || ""];
            if (!info) {
                return;
            }

            // Merge this page's own examples with examples for the same
            // component on other pages of a multi-page reference (excluding
            // this page, already covered by the precise same-page scan).
            const crossPageExamples = (crossPageIndex.get(name) ?? []).filter(
                (ref) => !ref.href.startsWith(`${currentRoute}#`),
            );
            const { attrLinks, propLinks } = buildExampleLinks(info, [
                ...samePageExamples,
                ...crossPageExamples,
            ]);

            if (node.name === "AttrDisplay") {
                injectAttrs(node, info, file);
                // Standalone <AttrDisplay> renders only attributes, so its
                // `links` prop carries the attribute-example anchors.
                injectLinksAttribute(node, "links", attrLinks);
            }
            if (node.name === "PropDisplay") {
                injectProps(node, info, file);
                // Standalone <PropDisplay> renders only properties.
                injectLinksAttribute(node, "links", propLinks);
            }
            if (node.name === "ComponentDisplay") {
                injectSummary(node, info, file);
            }
            if (node.name === "AttrPropDisplay") {
                // <AttrPropDisplay> renders the attribute and property
                // sections (or "no attributes/properties" messages), so it
                // needs both data sets. This injection does not depend on the
                // node's position, so it always runs.
                injectAttrs(node, info, file);
                injectProps(node, info, file);
                // Attribute and property examples are kept in separate maps so
                // a name that is both an attribute and a property (e.g.
                // `format`) links to the right kind of example — or to none,
                // when only one kind of example exists.
                injectLinksAttribute(node, "attrLinks", attrLinks);
                injectLinksAttribute(node, "propLinks", propLinks);

                // Emit the section heading as a real Markdown heading so it
                // picks up the theme's heading styling, anchor, and TOC entry.
                // A flow element should always have a parent and numeric
                // index; if it does not, the tree is malformed — surface a
                // warning rather than silently dropping the heading.
                if (!parent || typeof index !== "number") {
                    file.message(
                        `<AttrPropDisplay name="${name}"> has no parent node; ` +
                            `the "Attributes and Properties" heading was not inserted.`,
                        node,
                    );
                    return;
                }
                const heading: Heading = {
                    type: "heading",
                    depth: 2,
                    children: [
                        { type: "text", value: "Attributes and Properties" },
                    ],
                };
                parent.children.splice(index, 0, heading);
                // Continue past the inserted heading and this node.
                return index + 2;
            }
        });
    };
};

/** Whether `node` already carries an attribute named `attrName`. */
function hasAttribute(node: MdxJsxFlowElement, attrName: string): boolean {
    return node.attributes.some(
        (attr) => attr.type === "mdxJsxAttribute" && attr.name === attrName,
    );
}

/** Inject the schema `attrs` data onto an `<AttrDisplay>`/`<AttrPropDisplay>`. */
function injectAttrs(
    node: MdxJsxFlowElement,
    info: OptimizedInfo,
    file: { data: Record<string, any> },
): void {
    if (hasAttribute(node, "attrs")) {
        return;
    }
    node.attributes.push({
        type: "mdxJsxAttribute",
        name: "attrs",
        value: {
            type: "mdxJsxAttributeValueExpression",
            value: JSON.stringify(info.attrs),
            data: {
                estree: objectToEstree(info.attrs),
            },
        },
    });

    // Add some data that will be used for search. Include the descriptions
    // so searches match the explanatory text too.
    file.data.extraSearchData["attr-list#Attribute"] = info.attrs
        .filter((attr) => !attr.common)
        .map((attr) => `${attr.name}: ${attr.description}`)
        .join("\n");
}

/** Inject the schema `props` data onto a `<PropDisplay>`/`<AttrPropDisplay>`. */
function injectProps(
    node: MdxJsxFlowElement,
    info: OptimizedInfo,
    file: { data: Record<string, any> },
): void {
    if (hasAttribute(node, "props")) {
        return;
    }
    node.attributes.push({
        type: "mdxJsxAttribute",
        name: "props",
        value: {
            type: "mdxJsxAttributeValueExpression",
            value: JSON.stringify(info.props),
            data: {
                estree: objectToEstree(info.props),
            },
        },
    });

    // Add some data that will be used for search. Include the descriptions
    // so searches match the explanatory text too.
    file.data.extraSearchData["prop-list#Property"] = info.props
        .filter((prop) => !prop.common)
        .map((prop) => `${prop.name}: ${prop.description}`)
        .join("\n");
}

/**
 * Build two maps — one for attributes, one for properties — pairing each
 * listed name with the anchor of its worked example. "Attribute Example: …"
 * headings only feed the attribute map and "Property Example: …" headings only
 * the property map, so a name that is both an attribute and a property (e.g.
 * `format`) links to the correct kind of example (or to none, when only one
 * kind exists). Keys are the real attribute/property names so the renderer's
 * `links[name]` lookup hits; heading tokens are matched case-insensitively.
 */
function buildExampleLinks(
    info: OptimizedInfo,
    examples: ExampleRef[],
): { attrLinks: Record<string, string>; propLinks: Record<string, string> } {
    const attrNames = new Map(
        info.attrs.map((attr) => [attr.name.toLowerCase(), attr.name]),
    );
    const propNames = new Map(
        info.props.map((prop) => [prop.name.toLowerCase(), prop.name]),
    );
    const attrLinks: Record<string, string> = {};
    const propLinks: Record<string, string> = {};
    for (const example of examples) {
        const isAttr = example.kind === "attribute";
        const lookup = isAttr ? attrNames : propNames;
        const target = isAttr ? attrLinks : propLinks;
        for (const token of example.names) {
            const realName = lookup.get(token.toLowerCase());
            // Keep the first match (the same-page example is listed first), so
            // an on-page example wins over a cross-page one of the same name.
            if (realName && target[realName] === undefined) {
                target[realName] = example.href;
            }
        }
    }
    return { attrLinks, propLinks };
}

/** Inject a links map onto a node under `attrName`, skipping empty maps. */
function injectLinksAttribute(
    node: MdxJsxFlowElement,
    attrName: string,
    links: Record<string, string>,
): void {
    if (hasAttribute(node, attrName) || Object.keys(links).length === 0) {
        return;
    }
    node.attributes.push({
        type: "mdxJsxAttribute",
        name: attrName,
        value: {
            type: "mdxJsxAttributeValueExpression",
            value: JSON.stringify(links),
            data: {
                estree: objectToEstree(links),
            },
        },
    });
}

/** Inject the schema `summary` onto a `<ComponentDisplay>`. */
function injectSummary(
    node: MdxJsxFlowElement,
    info: OptimizedInfo,
    file: { data: Record<string, any> },
): void {
    if (hasAttribute(node, "summary")) {
        return;
    }
    node.attributes.push({
        type: "mdxJsxAttribute",
        name: "summary",
        value: info.summary,
    });

    // Add the summary to the search data.
    file.data.extraSearchData["component-summary#Description"] = info.summary;
}

/**
 * Turn a plain JS object into an ESTree object suitable for including in a `mdxJsxAttributeValueExpression`.
 */
function objectToEstree(obj: any): EstreeProgram {
    const estreeRaw = parseModule(`const IGNORE = ${JSON.stringify(obj)}`);

    const decl = estreeRaw.body[0];
    if (decl.type !== "VariableDeclaration") {
        throw new Error("PARSE ERROR: Expected a VariableDeclaration");
    }
    const decl2 = decl.declarations[0];
    if (decl2.type !== "VariableDeclarator") {
        throw new Error("PARSE ERROR: Expected a VariableDeclarator");
    }
    const expr = decl2.init;
    if (!expr) {
        throw new Error("PARSE ERROR: Expected an Expression");
    }

    return {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: expr,
            },
        ],
        sourceType: "module",
    };
}
