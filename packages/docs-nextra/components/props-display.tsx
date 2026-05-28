"use client";

import { Link } from "nextra-theme-docs";
import React, { useMemo, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { isMathDefaultValue } from "@doenet/static-assets/schema";

/** Types the rendering code special-cases. */
export type KnownPropAttrType =
    | "title"
    | "text"
    | "keyword"
    | "reference"
    | "referenceOrText"
    | "boolean"
    | "math"
    | "integer"
    | "number"
    | "textList"
    | "point";

/**
 * An attribute/prop type. The known types above are special-cased by the
 * rendering code, but the value is ultimately derived from `createComponentOfType`,
 * which is open-ended — so any other component type string is also valid. The
 * `(string & {})` keeps editor autocomplete for the known literals.
 */
export type PropAttrType = KnownPropAttrType | (string & {});

/** A single value an attribute may take, with an optional description. */
export type AttrValueInfo = {
    /** The literal value */
    value: string;
    /** Human-readable description of what the value does */
    description?: string;
};

export type AttrInfo = {
    /** Name of the attribute */
    name: string;
    /** Type of the attribute */
    type?: PropAttrType;
    /** Whether this attribute is common to all components (like `hide`) */
    common: boolean;
    /** Author-facing description of the attribute */
    description: string;
    /** Default value of the attribute, if it declares one */
    defaultValue?: unknown;
    /** Explicit values that the attribute may take */
    values?: AttrValueInfo[];
    /** Whether the attribute accepts an array of values */
    isArray?: boolean;
    /** Functional group this attribute belongs to (e.g. `"number-display"`). */
    groupName?: string;
    /** Whether this attribute is hand-picked into the "Highlighted" section. */
    highlighted?: boolean;
};

export type PropInfo = {
    /** Name of the prop */
    name: string;
    /** Type of the prop */
    type?: PropAttrType;
    /** Whether this prop is common to all components (like `hide`) */
    common: boolean;
    /** Author-facing description of the prop */
    description: string;
    /** Whether the prop accepts an array of values */
    isArray?: boolean;
    /** Functional group this prop belongs to (e.g. `"number-display"`). */
    groupName?: string;
    /** Whether this prop is hand-picked into the "Highlighted" section. */
    highlighted?: boolean;
};

/**
 * Display order for the known functional groups. Groups not listed here are
 * sorted alphabetically after the known ones, so adding a new `groupName` in
 * the worker never requires a change here to render (it just lands at the end).
 */
const GROUP_ORDER = [
    "number-display",
    "labels",
    "positioning",
    "styling",
    "answer-grading",
    "scoring",
    "triggering",
];

/** Human-readable section titles for the known functional groups. */
const GROUP_LABELS: Record<string, string> = {
    "number-display": "Number display",
    labels: "Labels",
    positioning: "Positioning",
    styling: "Styling",
    "answer-grading": "Answer grading",
    scoring: "Scoring",
    triggering: "Triggering",
};

function compareGroupNames(a: string, b: string): number {
    const ia = GROUP_ORDER.indexOf(a);
    const ib = GROUP_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) {
        return ia - ib;
    }
    if (ia !== -1) {
        return -1;
    }
    if (ib !== -1) {
        return 1;
    }
    return a.localeCompare(b);
}

type GroupItem = {
    name: string;
    common: boolean;
    groupName?: string;
    highlighted?: boolean;
    description: string;
};

type GroupSection<T> = {
    id: string;
    label: string;
    items: T[];
    defaultOpen: boolean;
};

/**
 * Partition an already-name-sorted list of attributes/properties into the
 * ordered, collapsible sections rendered in the docs:
 *   1. Highlighted (hand-picked, open by default)
 *   2. Functional groups (by `groupName`, in `GROUP_ORDER`, closed)
 *   3. Other (ungrouped, closed)
 *   4. Common to all components (closed, last)
 *
 * A highlighted item with a `groupName` intentionally appears in BOTH the
 * Highlighted section and its functional group. A highlighted item without a
 * group appears only in Highlighted (not also dumped into "Other"). `common`
 * items always sink to the last section regardless of any group tag.
 */
function partitionIntoSections<T extends GroupItem>(
    items: T[],
): GroupSection<T>[] {
    const highlighted: T[] = [];
    const common: T[] = [];
    const grouped = new Map<string, T[]>();
    const other: T[] = [];

    for (const item of items) {
        if (item.common) {
            common.push(item);
            continue;
        }
        if (item.highlighted) {
            highlighted.push(item);
        }
        if (item.groupName) {
            const arr = grouped.get(item.groupName) ?? [];
            arr.push(item);
            grouped.set(item.groupName, arr);
        } else if (!item.highlighted) {
            other.push(item);
        }
    }

    const sections: GroupSection<T>[] = [];
    if (highlighted.length > 0) {
        sections.push({
            id: "highlighted",
            label: "Highlighted",
            items: highlighted,
            defaultOpen: true,
        });
    }
    for (const groupName of [...grouped.keys()].sort(compareGroupNames)) {
        sections.push({
            id: `group:${groupName}`,
            label: GROUP_LABELS[groupName] ?? groupName,
            items: grouped.get(groupName)!,
            defaultOpen: false,
        });
    }
    if (other.length > 0) {
        sections.push({
            id: "other",
            label: "Other",
            items: other,
            defaultOpen: false,
        });
    }
    if (common.length > 0) {
        sections.push({
            id: "common",
            label: "Common to all components",
            items: common,
            defaultOpen: false,
        });
    }
    return sections;
}

/**
 * Render the inline backtick `code` spans in a description string; everything
 * else is plain text. Schema descriptions use only this one bit of markdown
 * (e.g. "Like `numbers`, but does not reorder commutative operands."), so a
 * full markdown renderer would be overkill.
 */
function renderInlineCode(text: string): React.ReactNode {
    if (!text.includes("`")) {
        return text;
    }
    // Splitting on backticks puts plain text at even indices and the contents
    // of each `code` span at odd indices.
    return text.split("`").map((part, i) =>
        i % 2 === 1 ? (
            <code className="attr-inline-code" key={i}>
                {part}
            </code>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        ),
    );
}

/** Render an attribute/property name, linking it to its worked example when
 * `links` has an entry for it. */
function renderName(
    name: string,
    links: Record<string, string>,
): React.ReactNode {
    const linkTarget = links[name];
    return linkTarget ? <Link href={linkTarget}>{name}</Link> : name;
}

/** Render a single attribute item. `idPrefix` keeps DOM ids unique across the
 * Highlighted duplicate (`attr-hl-…`) and the canonical copy (`attr-…`). */
function renderAttrItem(
    attr: AttrInfo,
    links: Record<string, string>,
    idPrefix: string,
) {
    const nameElm = renderName(attr.name, links);
    const typeLabel = formatType(attr.type, attr.isArray);
    const isKeyword = attr.type === "keyword";
    const defaultNode = renderDefaultValue(attr.defaultValue);
    // `boolean` attributes only ever take true/false, so the value table would
    // be noise — skip it for them.
    const showValues =
        attr.type !== "boolean" &&
        attr.values != null &&
        attr.values.length > 0;
    return (
        <div
            className="attr-item"
            id={`${idPrefix}-${attr.name}`}
            key={attr.name}
        >
            <div>
                <code className="attr-name attr-name-box">{nameElm}</code>
            </div>
            <p className="attr-detail">
                {typeLabel ? (
                    <>
                        <em className="attr-type">{typeLabel}</em>.{" "}
                    </>
                ) : null}
                {/* The default value follows the type, except for keyword
                attributes, where it is marked in the value list below. Math
                defaults are typeset by MathJax, so we render them in a plain
                `<span>` instead of `<code>` — wrapping typeset math inside a
                monospace `<code>` block produces awkward mixed-typography
                output. */}
                {!isKeyword && defaultNode !== null ? (
                    <>
                        Default value:{" "}
                        {isMathDefaultValue(attr.defaultValue) ? (
                            <span className="attr-default attr-default-math">
                                {defaultNode}
                            </span>
                        ) : (
                            <code className="attr-default">{defaultNode}</code>
                        )}
                        .{" "}
                    </>
                ) : null}
                {renderInlineCode(attr.description)}
            </p>
            {showValues ? (
                <table className="attr-value-table">
                    <thead>
                        <tr>
                            <th>Value</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attr.values!.map((v) => {
                            const isDefault =
                                attr.defaultValue != null &&
                                String(attr.defaultValue) === v.value;
                            return (
                                <tr key={v.value}>
                                    <td>
                                        <code className="attr-value-chip">
                                            {v.value}
                                        </code>
                                        {isDefault ? (
                                            <span className="attr-default-marker">
                                                {" "}
                                                (default)
                                            </span>
                                        ) : null}
                                    </td>
                                    <td>
                                        {v.description
                                            ? renderInlineCode(v.description)
                                            : ""}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : null}
        </div>
    );
}

/** Render a single property item. */
function renderPropItem(
    prop: PropInfo,
    refName: string,
    links: Record<string, string>,
    idPrefix: string,
) {
    const nameElm = renderName(prop.name, links);
    const typeLabel = formatType(prop.type, prop.isArray);
    return (
        <div
            className="prop-item"
            id={`${idPrefix}-${prop.name}`}
            key={prop.name}
        >
            <div>
                <code className="prop-name-box">
                    ${refName}.<span className="prop-name">{nameElm}</span>
                </code>
            </div>
            <p className="prop-detail">
                {typeLabel ? (
                    <>
                        <em className="prop-type">{typeLabel}</em>.{" "}
                    </>
                ) : null}
                {renderInlineCode(prop.description)}
            </p>
        </div>
    );
}

/** One collapsible group: a `<details>` controlled by React state so the
 * page-level Reveal/Collapse-all toggle stays authoritative. */
function CollapsibleGroup({
    title,
    count,
    open,
    onToggle,
    children,
}: React.PropsWithChildren<{
    title: string;
    count: number;
    open: boolean;
    onToggle: () => void;
}>) {
    return (
        <details className="attr-group" open={open}>
            <summary
                className="attr-group-summary"
                onClick={(e) => {
                    // Own the open state in React rather than letting the
                    // browser toggle natively, so Reveal/Collapse-all wins.
                    e.preventDefault();
                    onToggle();
                }}
            >
                {title}
                <span className="attr-group-count"> ({count})</span>
            </summary>
            <div className="attr-group-body">{children}</div>
        </details>
    );
}

/**
 * The interactive body shared by `AttrDisplay`, `PropDisplay`, and
 * `AttrPropDisplay`: one filter box + Reveal/Collapse-all toggle controlling
 * the collapsible attribute and/or property sections.
 */
function CollapsibleAttrPropSection({
    name,
    attrs,
    props,
    attrLinks = {},
    propLinks = {},
    attrCaptionName,
    propCaptionName,
    missingAttrsNote = null,
    missingPropsNote = null,
}: {
    name: string;
    attrs?: AttrInfo[];
    props?: PropInfo[];
    /** Map of attribute name → anchor of its worked example. */
    attrLinks?: Record<string, string>;
    /** Map of property name → anchor of its worked example. */
    propLinks?: Record<string, string>;
    attrCaptionName?: React.ReactNode;
    propCaptionName?: React.ReactNode;
    missingAttrsNote?: React.ReactNode;
    missingPropsNote?: React.ReactNode;
}) {
    const refName = name.charAt(0).toLowerCase();

    const attrSections = useMemo(
        () => (attrs ? partitionIntoSections(attrs) : []),
        [attrs],
    );
    const propSections = useMemo(
        () => (props ? partitionIntoSections(props) : []),
        [props],
    );

    const [query, setQuery] = useState("");
    const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
        const map: Record<string, boolean> = {};
        for (const s of attrSections) {
            map[`attr:${s.id}`] = s.defaultOpen;
        }
        for (const s of propSections) {
            map[`prop:${s.id}`] = s.defaultOpen;
        }
        return map;
    });

    const q = query.trim().toLowerCase();
    const filtering = q !== "";
    const matches = (item: GroupItem) =>
        !filtering ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

    const allKeys = [
        ...attrSections.map((s) => `attr:${s.id}`),
        ...propSections.map((s) => `prop:${s.id}`),
    ];
    const allOpen = allKeys.length > 0 && allKeys.every((k) => openMap[k]);
    const toggle = (key: string) =>
        setOpenMap((m) => ({ ...m, [key]: !m[key] }));
    const setAll = (value: boolean) =>
        setOpenMap(Object.fromEntries(allKeys.map((k) => [k, value])));

    const attrsNeedMath = (attrs ?? []).some((a) =>
        isMathDefaultValue(a.defaultValue),
    );

    const renderSections = (
        sections: GroupSection<AttrInfo | PropInfo>[],
        kind: "attr" | "prop",
    ) =>
        sections.map((section) => {
            const key = `${kind}:${section.id}`;
            const visibleItems = section.items.filter(matches);
            if (filtering && visibleItems.length === 0) {
                return null;
            }
            const open = filtering ? true : Boolean(openMap[key]);
            // The Highlighted section duplicates items that also appear in a
            // functional group, so it gets an `-hl` id prefix to keep DOM ids
            // unique (e.g. `attr-hl-displayDigits` vs. `attr-displayDigits`).
            const idPrefix = kind + (section.id === "highlighted" ? "-hl" : "");
            return (
                <CollapsibleGroup
                    key={key}
                    title={section.label}
                    count={visibleItems.length}
                    open={open}
                    onToggle={() => toggle(key)}
                >
                    {kind === "attr"
                        ? (visibleItems as AttrInfo[]).map((item) =>
                              renderAttrItem(item, attrLinks, idPrefix),
                          )
                        : (visibleItems as PropInfo[]).map((item) =>
                              renderPropItem(
                                  item,
                                  refName,
                                  propLinks,
                                  idPrefix,
                              ),
                          )}
                </CollapsibleGroup>
            );
        });

    const renderedAttrSections = renderSections(attrSections, "attr");
    const renderedPropSections = renderSections(propSections, "prop");
    const attrAllHidden =
        renderedAttrSections.length > 0 &&
        renderedAttrSections.every((s) => s === null);
    const propAllHidden =
        renderedPropSections.length > 0 &&
        renderedPropSections.every((s) => s === null);

    return (
        <>
            <div className="attr-prop-controls">
                <input
                    type="search"
                    className="attr-filter-input"
                    placeholder="Filter attributes and properties…"
                    aria-label="Filter attributes and properties"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {!filtering && allKeys.length > 0 ? (
                    <button
                        type="button"
                        className="reveal-all-toggle"
                        onClick={() => setAll(!allOpen)}
                    >
                        {allOpen ? "Collapse all" : "Expand all"}
                    </button>
                ) : null}
            </div>

            {attrs ? (
                <WithMathJaxIfNeeded needed={attrsNeedMath}>
                    <div className="attr-list" id="attr-list">
                        <h3 className="attr-list-caption">
                            Attributes for{" "}
                            {attrCaptionName || (
                                <code>
                                    {"<"}
                                    {name}
                                    {">"}
                                </code>
                            )}
                        </h3>
                        {renderedAttrSections}
                        {attrAllHidden ? (
                            <p className="attr-filter-empty">
                                No matching attributes.
                            </p>
                        ) : null}
                    </div>
                </WithMathJaxIfNeeded>
            ) : (
                missingAttrsNote
            )}

            {props ? (
                <div className="prop-list" id="prop-list">
                    <h3 className="prop-list-caption">
                        Properties for{" "}
                        {propCaptionName || (
                            <code>
                                {"<"}
                                {name} name="{refName}"{">"}
                            </code>
                        )}
                    </h3>
                    {renderedPropSections}
                    {propAllHidden ? (
                        <p className="attr-filter-empty">
                            No matching properties.
                        </p>
                    ) : null}
                </div>
            ) : (
                missingPropsNote
            )}
        </>
    );
}

export function AttrDisplay({
    name,
    attrs = [],
    links = {},
    children,
}: React.PropsWithChildren<{
    name: string;
    attrs: AttrInfo[];
    links?: Record<string, string>;
}>) {
    return (
        <CollapsibleAttrPropSection
            name={name}
            attrs={attrs}
            attrLinks={links}
            attrCaptionName={children}
        />
    );
}

export function PropDisplay({
    name,
    props = [],
    links = {},
    children,
}: React.PropsWithChildren<{
    name: string;
    props: PropInfo[];
    links?: Record<string, string>;
}>) {
    return (
        <CollapsibleAttrPropSection
            name={name}
            props={props}
            propLinks={links}
            propCaptionName={children}
        />
    );
}

/**
 * Renders the body of an "Attributes and Properties" section: the collapsible
 * attribute and property lists, substituting a short message for either one
 * when the component has none. The section heading itself is emitted as a real
 * Markdown heading by the `autoInsertAttrPropDescriptions` remark plugin.
 */
export function AttrPropDisplay({
    name,
    attrs = [],
    props = [],
    attrLinks = {},
    propLinks = {},
}: {
    name: string;
    attrs?: AttrInfo[];
    props?: PropInfo[];
    attrLinks?: Record<string, string>;
    propLinks?: Record<string, string>;
}) {
    const hasAttrs = attrs.length > 0;
    const hasProps = props.length > 0;
    const nameCode = (
        <code>
            {"<"}
            {name}
            {">"}
        </code>
    );

    if (!hasAttrs && !hasProps) {
        return <p>The {nameCode} component has no attributes or properties.</p>;
    }
    return (
        <CollapsibleAttrPropSection
            name={name}
            attrs={hasAttrs ? attrs : undefined}
            props={hasProps ? props : undefined}
            attrLinks={attrLinks}
            propLinks={propLinks}
            missingAttrsNote={
                <p>The {nameCode} component has no attributes.</p>
            }
            missingPropsNote={
                <p>The {nameCode} component has no properties.</p>
            }
        />
    );
}

/**
 * Format a type for display, putting `[…]` around it if it's an array.
 */
function formatType(typeName?: PropAttrType, isArray?: boolean) {
    if (!typeName) {
        return null;
    }
    // `referenceOrText` marks an attribute (e.g. `<ref to>`) that accepts a
    // URL string in addition to a component reference; spell it out so the
    // docs don't imply a plain string is invalid.
    const label =
        typeName === "referenceOrText" ? "reference or text" : typeName;
    return isArray ? `[ ${label} ]` : label;
}

/**
 * Render an attribute's default value for display. Returns `null` when
 * there is no meaningful default (`null`/`undefined`, an empty string, or
 * an empty array), so callers can omit the "Default value: …" prefix
 * altogether. Math-expression defaults (the `{ type: "math", latex }`
 * sentinel produced by `get-schema.ts`) are rendered through MathJax so the
 * actual expression — not the raw serialized object — appears in the docs.
 */
function renderDefaultValue(value: unknown): React.ReactNode {
    if (value == null) {
        return null;
    }
    if (isMathDefaultValue(value)) {
        // `\(…\)` is the MathJax inline-math delimiter. `dynamic` and
        // `hideUntilTypeset="first"` mirror how `<m>`-style math is
        // rendered elsewhere in DoenetML — the latter is hidden until the
        // first typeset pass, which avoids a flash of raw source on first
        // paint.
        return (
            <MathJax
                inline
                dynamic
                hideUntilTypeset="first"
            >{`\\(${value.latex}\\)`}</MathJax>
        );
    }
    if (typeof value === "string") {
        // An empty-string default carries no useful information.
        return value === "" ? null : value;
    }
    if (Array.isArray(value)) {
        // An empty-array default carries no useful information.
        return value.length === 0 ? null : JSON.stringify(value);
    }
    if (typeof value === "boolean" || typeof value === "number") {
        return String(value);
    }
    return JSON.stringify(value);
}

/**
 * Wrap children in a `MathJaxContext` only when at least one default value
 * needs MathJax to render — most components have no math defaults, and
 * mounting a context (which loads the MathJax script) on every reference
 * page would be wasteful. When no math is present we render children plain
 * to keep the DOM identical to the pre-MathJax behavior.
 */
function WithMathJaxIfNeeded({
    needed,
    children,
}: React.PropsWithChildren<{ needed: boolean }>) {
    if (!needed) {
        return <>{children}</>;
    }
    // `version={4}` matches the MathJax major version used elsewhere in
    // DoenetML (see `doenetml.tsx`).
    return <MathJaxContext version={4}>{children}</MathJaxContext>;
}
