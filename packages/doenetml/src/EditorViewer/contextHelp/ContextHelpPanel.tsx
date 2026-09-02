import React from "react";
import { MathJax } from "better-react-mathjax";
import { parseInlineMarkdown } from "@doenet/utils/markdown/parseInlineMarkdown";
import {
    formatComponentSize,
    isComponentSizeValue,
    isMathDefaultValue,
} from "@doenet/static-assets/schema";
import { isMacPlatform } from "@doenet/utils";
import type {
    FunctionNamesBreakdownPayload,
    HelpContent,
    SizeSyntaxPayload,
} from "@doenet/lsp-tools";
import type { Translator } from "@doenet/i18n";
import { useT } from "../../utils/i18n";
import { fillSlots, slot } from "../slots";
import "./context-help-panel.css";

/**
 * The key combination that opens the full element-completion menu, named for
 * the platform the editor is running on.
 *
 * CodeMirror's `completionKeymap` binds a literal `Ctrl-Space` on every
 * platform (it does not use `Mod-`, so this stays Control, not Cmd, on a Mac).
 * But macOS itself claims Control+Space for "Select the previous input
 * source", so on a Mac the keystroke is usually swallowed before the browser
 * ever sees it. Upstream ships mac-only alternates for exactly that reason —
 * `Alt-i` and ``Alt-` `` — so Mac users are pointed at Option+I, which does
 * reach the editor.
 */
export function completionShortcutLabel(
    isMac: boolean = isMacPlatform(),
): string {
    return isMac ? "Option+I" : "Ctrl+Space";
}

/**
 * Render schema description text, mapping the shared inline-markdown tokens
 * to React elements. The schema uses `` `code` ``, `**strong**`, and
 * `*em*`; anything else is emitted as literal text.
 *
 * The tokenizer is intentionally non-recursive — leftmost match wins and
 * its content is rendered verbatim (e.g. `*a `b` c*` → one `<em>a `b` c</em>`,
 * NOT `<em>a <code>b</code> c</em>`). Don't add a recursive renderer
 * thinking it's a bug; the schema doesn't use nested inline formatting.
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
    return parseInlineMarkdown(text).map((token, i) => {
        switch (token.kind) {
            case "text":
                return token.text;
            case "code":
                return <code key={i}>{token.text}</code>;
            case "strong":
                return <strong key={i}>{token.text}</strong>;
            case "em":
                return <em key={i}>{token.text}</em>;
        }
    });
}

/**
 * Render an element's `<tag>` name in the title row, as a link to its
 * reference page when a `docsSlug` is known and plain monospace text
 * otherwise. The element name links in addition to the footer "Reference
 * page →" link so authors can jump to the page from the heading too — the
 * footer link stays because authors miss inline links.
 */
function renderElementName(
    elementName: string,
    docsSlug: string | null,
    docsBase: string,
): React.ReactNode {
    const text = `<${elementName}>`;
    if (!docsSlug) {
        return <span className="help-element-name">{text}</span>;
    }
    return (
        <a
            className="help-element-name help-element-name-link"
            href={`${docsBase}/reference/${docsSlug}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            {text}
        </a>
    );
}

/**
 * Path (relative to the docs site root) of the page explaining what a
 * reference is. Reference help links here instead of to the referenced
 * component's own reference page — for a `$ref` the panel's job is to
 * explain the reference concept and where it points, not to advertise the
 * target component's docs.
 */
const REFERENCES_DOC_PATH = "concepts/references";

function ReferencesDocLink({ docsBase }: { docsBase: string }) {
    const t = useT();
    return (
        <a
            className="help-docs-link"
            href={`${docsBase}/${REFERENCES_DOC_PATH}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            {t(
                "help-learn-about-references",
                undefined,
                "Learn about references \u2192",
            )}
        </a>
    );
}

/** The footer link to an element's or attribute's own reference page. */
function ReferencePageLink({ href }: { href: string }) {
    const t = useT();
    return (
        <a
            className="help-docs-link"
            href={href}
            target="_blank"
            rel="noreferrer noopener"
        >
            {t("help-reference-page", undefined, "Reference page \u2192")}
        </a>
    );
}

/**
 * A line number as the catalog wants it: text, so Fluent hands it to no
 * `Intl.NumberFormat` and line 1234 stays "1234"; and `"none"` when there is
 * no position, so a sentence without one is a branch rather than an empty
 * parenthesis.
 */
function lineArg(line: number | undefined): string {
    return line === undefined ? "none" : String(line);
}

/**
 * The heading over an attribute's value list.
 *
 * An open list says "Suggested" rather than "Allowed": the attribute takes
 * other values too, and nothing warns about them. That gets its own key rather
 * than a third branch of `help-allowed-values`, whose selector splits
 * whole-value from per-item within one sentence.
 */
export function valueListLabel(
    t: Translator,
    {
        areSuggestions,
        arePerItem,
    }: { areSuggestions?: boolean; arePerItem?: boolean },
): string {
    if (areSuggestions) {
        return t("help-suggested-values", undefined, "Suggested values:");
    }
    return t(
        "help-allowed-values",
        { perItem: arePerItem ? "true" : "false" },
        arePerItem ? "Allowed values (one per item):" : "Allowed values:",
    );
}

export function ContextHelpPanel({
    content,
    docsURL,
}: {
    content: HelpContent;
    docsURL: string;
}) {
    const t = useT();
    // Tolerate a trailing slash on the consumer-supplied `docsURL` so that
    // e.g. "https://docs.doenet.org/" doesn't produce "//reference/..." URLs.
    const docsBase = docsURL.replace(/\/+$/, "");

    switch (content.kind) {
        case "none":
            return (
                <div className="help-panel help-panel-empty">
                    <p className="help-placeholder">
                        {fillSlots(
                            t(
                                "help-placeholder",
                                { ref: slot(0) },
                                `Place cursor on a tag name, attribute, or ${slot(0)} for documentation.`,
                            ),
                            [<code>$ref.property</code>],
                        )}
                    </p>
                </div>
            );

        case "unsupportedRefChain":
            return (
                <div className="help-panel help-panel-empty">
                    <p className="help-placeholder">
                        {fillSlots(
                            t(
                                "help-unsupported-ref-chain",
                                { example: slot(0) },
                                `Help for multi-part references like ${slot(0)} is not yet supported.`,
                            ),
                            [<code>$a.b.c</code>],
                        )}
                    </p>
                </div>
            );

        case "unresolvedRef": {
            const { displayPath, reason } = content;
            const ref = <code>{`$${displayPath}`}</code>;
            // `notFound`/`multiple` are authoritative resolver verdicts;
            // `indeterminate` hedges so an incomplete-view miss is never
            // presented as a definite "no referent". Which one it is selects
            // the sentence in the catalog rather than in the JSX.
            const english =
                reason === "notFound"
                    ? `No referent found for reference: ${slot(0)}.`
                    : reason === "multiple"
                      ? `Multiple referents found for reference: ${slot(0)}.`
                      : `A referent for ${slot(0)} could not be determined.`;
            const sentence = fillSlots(
                t("help-unresolved-ref", { reason, ref: slot(0) }, english),
                [ref],
            );
            return (
                <div className="help-panel">
                    <p className="help-ref-sentence">{sentence}</p>
                    <ReferencesDocLink docsBase={docsBase} />
                </div>
            );
        }

        case "suggestions": {
            const { context, suggested, totalAllowed, acceptsStringChildren } =
                content;
            // Narrowed here rather than re-tested below, so the element name
            // never needs a cast to be read.
            const containerName =
                "elementName" in context ? context.elementName : null;
            // Four cases the header line discriminates:
            //   - nothing allowed at all → "<x> — nothing goes here."
            //   - text only             → "<x> — type text here."
            //   - components only       → "<x> — things to try:" (today)
            //   - text + components     → "<x> — type text here, or try:"
            const allowed =
                totalAllowed === 0
                    ? acceptsStringChildren
                        ? "text"
                        : "none"
                    : acceptsStringChildren
                      ? "text-and-components"
                      : "components";
            const englishSuffix = {
                text: " — type text here.",
                none: " — nothing goes here.",
                "text-and-components": " — type text here, or try:",
                components: " — things to try:",
            }[allowed];
            return (
                <div className="help-panel">
                    <p className="help-suggestions-header">
                        {fillSlots(
                            t(
                                "help-suggestions-header",
                                {
                                    location:
                                        containerName === null
                                            ? "top"
                                            : "inside",
                                    element: slot(0),
                                    allowed,
                                },
                                (containerName === null
                                    ? "At the top level"
                                    : `Inside ${slot(0)}`) + englishSuffix,
                            ),
                            [
                                containerName === null ? null : (
                                    <code>{`<${containerName}>`}</code>
                                ),
                            ],
                        )}
                    </p>
                    {suggested.length > 0 && (
                        <ul className="help-suggestions-list">
                            {suggested.map((s) => (
                                <li
                                    key={s.name}
                                    className="help-suggestion-item"
                                >
                                    {renderElementName(
                                        s.name,
                                        s.docsSlug,
                                        docsBase,
                                    )}
                                    {s.summary && (
                                        <span className="help-suggestion-summary">
                                            {/* The name is already rendered
                                                beside this, so it is empty
                                                here: what is wanted is the
                                                separator the same message puts
                                                between the two. */}
                                            {fillSlots(
                                                t(
                                                    "help-name-summary",
                                                    {
                                                        name: "",
                                                        summary: slot(0),
                                                    },
                                                    ` — ${slot(0)}`,
                                                ),
                                                [
                                                    renderInlineMarkdown(
                                                        s.summary,
                                                    ),
                                                ],
                                            )}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {totalAllowed > 0 && (
                        <p className="help-suggestions-footer">
                            {fillSlots(
                                t(
                                    "help-suggestions-footer",
                                    {
                                        shortcut: slot(0),
                                        total: totalAllowed,
                                    },
                                    `Press ${slot(0)} to see all ${totalAllowed} components.`,
                                ),
                                [<code>{completionShortcutLabel()}</code>],
                            )}
                        </p>
                    )}
                </div>
            );
        }

        case "element":
            // The summary is one short sentence, so it rides on the title
            // line after the linked name (em-dash separated) rather than in a
            // separate paragraph — most info at a glance.
            return (
                <div className="help-panel">
                    <p className="help-element-title">
                        {fillSlots(
                            t(
                                "help-name-summary",
                                { name: slot(0), summary: slot(1) },
                                `${slot(0)} — ${slot(1)}`,
                            ),
                            [
                                renderElementName(
                                    content.elementName,
                                    content.docsSlug,
                                    docsBase,
                                ),
                                renderInlineMarkdown(content.summary),
                            ],
                        )}
                    </p>
                    {content.styleBreakdown &&
                        renderStyleBreakdown(t, content.styleBreakdown)}
                    {content.docsSlug && (
                        <ReferencePageLink
                            href={`${docsBase}/reference/${content.docsSlug}`}
                        />
                    )}
                </div>
            );

        case "refName": {
            const { displayPath, targetElementName, line, derivedFrom } =
                content;
            // Reference help is framed around the reference itself — what it
            // points at and where — not the target component's summary/docs
            // page. The only outbound link explains references in general.
            return (
                <div className="help-panel">
                    <p className="help-ref-sentence">
                        {fillSlots(
                            t(
                                "help-ref-is-reference",
                                {
                                    ref: slot(0),
                                    target: slot(1),
                                    line: lineArg(line),
                                },
                                line === undefined
                                    ? `${slot(0)} is a reference to ${slot(1)}.`
                                    : `${slot(0)} is a reference to ${slot(1)} (line ${line}).`,
                            ),
                            [
                                <code>{`$${displayPath}`}</code>,
                                <code>{`<${targetElementName}>`}</code>,
                            ],
                        )}
                    </p>
                    {derivedFrom && (
                        <p className="help-ref-derived">
                            {fillSlots(
                                t(
                                    "help-ref-derived-from",
                                    {
                                        owner: slot(0),
                                        role: slot(1),
                                        line: lineArg(derivedFrom.ownerLine),
                                    },
                                    derivedFrom.ownerLine === undefined
                                        ? `Introduced by ${slot(0)} as ${slot(1)}.`
                                        : `Introduced by ${slot(0)} on line ${derivedFrom.ownerLine} as ${slot(1)}.`,
                                ),
                                [
                                    <code>{`<${derivedFrom.ownerElementName}>`}</code>,
                                    <code>{derivedFrom.role}</code>,
                                ],
                            )}
                        </p>
                    )}
                    <ReferencesDocLink docsBase={docsBase} />
                </div>
            );
        }

        case "attribute": {
            const {
                elementName,
                attributeName,
                description,
                docsSlug,
                allowedValues,
                allowedValuesArePerItem,
                allowedValuesAreSuggestions,
                defaultValue,
                activeDefault,
                styleBreakdown,
                functionNamesBreakdown,
                sizeSyntax,
            } = content;
            return (
                <div className="help-panel">
                    <div className="help-title">
                        {renderElementName(elementName, docsSlug, docsBase)}
                        <span className="help-kind-label">
                            {t("help-kind-attribute", undefined, "attribute")}
                        </span>
                        <span className="help-attribute-name">
                            {attributeName}
                        </span>
                    </div>
                    <p className="help-description">
                        {renderInlineMarkdown(description)}
                    </p>
                    {defaultValue !== undefined &&
                        defaultValue !== null &&
                        // An empty-array default (e.g. `additionalFunctionNames`,
                        // `removedFunctionNames`) would render as just
                        // "Default:" with no value, which is noise — suppress
                        // the row entirely.
                        !(
                            Array.isArray(defaultValue) &&
                            defaultValue.length === 0
                        ) && (
                            <div className="help-detail">
                                <span className="help-detail-label">
                                    {t("help-default", undefined, "Default:")}
                                </span>
                                <div className="help-values-list">
                                    <span className="help-value-item">
                                        {formatValue(defaultValue)}
                                    </span>
                                </div>
                            </div>
                        )}
                    {activeDefault && (
                        // Separate row from "Default:" so the author can tell
                        // the static schema fallback from the live inherited
                        // value (#1198).
                        <div className="help-detail">
                            <span className="help-detail-label">
                                {t(
                                    "help-active-default",
                                    undefined,
                                    "Active default:",
                                )}
                            </span>
                            <div className="help-values-list">
                                {renderActiveDefaultValue(activeDefault)}
                                <span className="help-detail-annotation">
                                    {t(
                                        "help-style-number-annotation",
                                        {
                                            styleNumber: String(
                                                activeDefault.styleNumber,
                                            ),
                                        },
                                        ` (styleNumber ${activeDefault.styleNumber})`,
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                    {styleBreakdown && renderStyleBreakdown(t, styleBreakdown)}
                    {functionNamesBreakdown &&
                        renderFunctionNamesBreakdown(t, functionNamesBreakdown)}
                    {sizeSyntax && renderSizeSyntax(t, sizeSyntax)}
                    {allowedValues && allowedValues.length > 0 && (
                        <div className="help-detail help-allowed-values">
                            <span className="help-detail-label">
                                {valueListLabel(t, {
                                    areSuggestions: allowedValuesAreSuggestions,
                                    arePerItem: allowedValuesArePerItem,
                                })}
                            </span>
                            <dl className="help-allowed-values-list">
                                {allowedValues.map(
                                    ({ value, description }, idx) => (
                                        <React.Fragment key={idx}>
                                            <dt className="help-value-item">
                                                {formatValue(value)}
                                            </dt>
                                            <dd className="help-value-description">
                                                {renderInlineMarkdown(
                                                    description,
                                                )}
                                            </dd>
                                        </React.Fragment>
                                    ),
                                )}
                            </dl>
                        </div>
                    )}
                    {docsSlug && (
                        <ReferencePageLink
                            href={`${docsBase}/reference/${docsSlug}`}
                        />
                    )}
                </div>
            );
        }

        case "snippet": {
            const { snippetKey, elementName, description, snippetText } =
                content;
            return (
                <div className="help-panel">
                    <div className="help-title">
                        <span className="help-kind-label">
                            {t("help-kind-snippet", undefined, "snippet")}
                        </span>
                        <span className="help-snippet-name">{snippetKey}</span>
                    </div>
                    <p className="help-description">{description}</p>
                    <div className="help-detail">
                        <span className="help-detail-label">
                            {t("help-inserts", undefined, "Inserts:")}
                        </span>
                        <span className="help-detail-value">{`<${elementName}>`}</span>
                    </div>
                    <pre className="help-snippet-preview">
                        <code>{snippetText}</code>
                    </pre>
                </div>
            );
        }

        case "arrayEntry": {
            const {
                elementName,
                aliasPath,
                displayTail,
                description,
                leafType,
                docsSlug,
            } = content;
            // `displayTail` is pre-rendered by the help layer from
            // `rawPathParts`, so the title shows the author's literal
            // bracket-index values (`points[1].x`) rather than a `[…]`
            // placeholder.
            return (
                <div className="help-panel">
                    <div className="help-title">
                        {renderElementName(elementName, docsSlug, docsBase)}
                        <span className="help-kind-label">
                            {t(
                                "help-kind-array-entry",
                                undefined,
                                "array entry",
                            )}
                        </span>
                        <span className="help-property-name">
                            {displayTail}
                        </span>
                    </div>
                    <p className="help-description">
                        {renderInlineMarkdown(description)}
                    </p>
                    {aliasPath.length > 0 && (
                        <div className="help-detail">
                            <span className="help-detail-label">
                                {t(
                                    "help-coordinates",
                                    { count: aliasPath.length },
                                    aliasPath.length === 1
                                        ? "Coordinate:"
                                        : "Coordinates:",
                                )}
                            </span>
                            <span className="help-detail-value">
                                {aliasPath.join(", ")}
                            </span>
                        </div>
                    )}
                    {leafType && (
                        <div className="help-detail">
                            <span className="help-detail-label">
                                {t("help-type", undefined, "Type:")}
                            </span>
                            <span className="help-detail-value">
                                {`<${leafType}>`}
                            </span>
                        </div>
                    )}
                    {docsSlug && (
                        <ReferencePageLink
                            href={`${docsBase}/reference/${docsSlug}`}
                        />
                    )}
                </div>
            );
        }

        case "property": {
            const {
                elementName,
                propertyName,
                description,
                displayPath,
                line,
                type,
                isArray,
            } = content;
            // A property reference (`$m.splitSymbols`) is framed as a
            // reference first — what it points at and where — then the
            // property's own meaning/type. No link to the container
            // component's page; the references link is the only outbound one.
            return (
                <div className="help-panel">
                    <p className="help-ref-sentence">
                        {fillSlots(
                            t(
                                "help-property-is-reference",
                                {
                                    ref: slot(0),
                                    property: slot(1),
                                    element: slot(2),
                                    line: lineArg(line),
                                },
                                line === undefined
                                    ? `${slot(0)} is a reference to the ${slot(1)} property of ${slot(2)}.`
                                    : `${slot(0)} is a reference to the ${slot(1)} property of ${slot(2)} (line ${line}).`,
                            ),
                            [
                                <code>{`$${displayPath}`}</code>,
                                <code>{propertyName}</code>,
                                <code>{`<${elementName}>`}</code>,
                            ],
                        )}
                    </p>
                    <p className="help-description">
                        {renderInlineMarkdown(description)}
                    </p>
                    {type !== undefined && (
                        <div className="help-detail">
                            <span className="help-detail-label">
                                {t("help-type", undefined, "Type:")}
                            </span>
                            <span className="help-detail-value">
                                {`<${type}>`}
                                {isArray ? "[]" : ""}
                            </span>
                        </div>
                    )}
                    <ReferencesDocLink docsBase={docsBase} />
                </div>
            );
        }
    }
}

/**
 * For a color attribute, render the resolved color text alongside the
 * derived word, both painted in the resolved color so authors can see
 * what the hex represents at a glance.  Returns `null` when the entry
 * isn't a recognized color (no `colorWord`, or `value` isn't a string) so
 * callers can fall back to plain `formatValue` rendering.
 */
function renderColorValueContent(entry: {
    value: string | number | boolean;
    colorWord?: string;
}): React.ReactNode | null {
    if (!entry.colorWord || typeof entry.value !== "string") return null;
    const colorText = resolveCssVariables(entry.value);
    const colorStyle = { color: colorText };
    return (
        <>
            <span style={colorStyle}>{colorText}</span>
            <span style={colorStyle}>{` (${entry.colorWord})`}</span>
        </>
    );
}

// Paint hex and derived word in the resolved color for color attributes so
// authors don't have to decode the hex. Non-color values fall through to
// `formatValue`.  The outer `<span class="help-value-item">` supplies the
// pill background — color rows nest the colored content inside it so the
// pill stays consistent with non-color rows.
function renderActiveDefaultValue(activeDefault: {
    value: string | number | boolean;
    colorWord?: string;
}): React.ReactNode {
    const colorContent = renderColorValueContent(activeDefault);
    return (
        <span className="help-value-item">
            {colorContent ?? formatValue(activeDefault.value)}
        </span>
    );
}

// One row in the styleNumber breakdown (#1204). Color attributes paint the
// hex (and word) in the resolved color, mirroring `renderActiveDefaultValue`
// so the two surfaces look consistent.  The enclosing `<dd>` already
// supplies the pill styling, so this returns the inner content directly.
function renderBreakdownValue(entry: {
    value: string | number | boolean;
    colorWord?: string;
}): React.ReactNode {
    return renderColorValueContent(entry) ?? formatValue(entry.value);
}

/**
 * "Resolved style" section shared by the attribute and element help branches
 * (#1204). Renders the styleNumber-labeled header above a two-column
 * key/value grid for each populated style attribute.  The caller decides
 * when to mount it; this helper just keeps the markup in one place so the
 * two trigger sites can't drift in layout or class names.
 */
function renderStyleBreakdown(
    t: Translator,
    breakdown: {
        styleNumber: number;
        entries: Array<{
            key: string;
            value: string | number | boolean;
            colorWord?: string;
        }>;
    },
): React.ReactNode {
    return (
        <div className="help-detail help-style-breakdown">
            <span className="help-detail-label">
                {t(
                    "help-resolved-style",
                    { styleNumber: String(breakdown.styleNumber) },
                    `Resolved style (styleNumber ${breakdown.styleNumber}):`,
                )}
            </span>
            <dl className="help-style-breakdown-list">
                {breakdown.entries.map((entry) => (
                    <React.Fragment key={entry.key}>
                        <dt>{entry.key}</dt>
                        <dd>{renderBreakdownValue(entry)}</dd>
                    </React.Fragment>
                ))}
            </dl>
        </div>
    );
}

/**
 * Render a label + chip-list pair, used by the function-names breakdown and
 * accepted-sizes sections. Each chip is a `help-value-item` pill and the chips
 * wrap via the parent `help-values-list` flex row.
 */
function renderLabeledChipList(
    label: string,
    items: readonly string[],
): React.ReactNode {
    return (
        <>
            <span className="help-detail-label">{label}</span>
            <div className="help-values-list">
                {items.map((name) => (
                    <span key={name} className="help-value-item">
                        {name}
                    </span>
                ))}
            </div>
        </>
    );
}

/**
 * "Accepted sizes" section surfaced for any attribute whose value is a
 * `componentSize`. The attribute description says what the dimension means
 * but never that a plain number is pixels, that `6in` and
 * `15cm` are read, or that a percentage is allowed — so the forms are listed
 * as chips, with a note naming the unit a bare number carries.
 *
 * `examples` already carries only the forms the attribute honors (a height
 * gets no percentage; a side-by-side width gets nothing but the percentage),
 * so the note is chosen from what is in the list rather than from the
 * attribute's identity: raising a form only to rule it out reads worse than
 * never raising it.
 */
function renderSizeSyntax(
    t: Translator,
    sizeSyntax: SizeSyntaxPayload,
): React.ReactNode {
    return (
        <div className="help-detail help-size-syntax">
            {renderLabeledChipList(
                t("help-accepted-sizes", undefined, "Accepted sizes:"),
                sizeSyntax.examples.map(({ value }) => value),
            )}
            <span className="help-detail-annotation">
                {sizeUnitsNote(t, sizeSyntax)}
            </span>
            {sizeSyntax.snapsToSizePreset && (
                <span className="help-detail-annotation">
                    {t(
                        "help-size-snaps-to-preset",
                        // `size` names the sibling attribute, so it is an
                        // argument rather than a word in the sentence.
                        { size: "size" },
                        "This width picks the nearest size preset rather than being used exactly.",
                    )}
                </span>
            )}
        </div>
    );
}

/**
 * The sentence under the "Accepted sizes" chips, naming the unit each listed
 * form carries. One key per combination the payload can produce, so no
 * translation has to assemble a sentence out of clauses.
 */
function sizeUnitsNote(t: Translator, sizeSyntax: SizeSyntaxPayload): string {
    const hasAbsolute = sizeSyntax.examples.some((e) => e.kind === "absolute");
    const hasRelative = sizeSyntax.examples.some((e) => e.kind === "relative");

    if (!hasAbsolute) {
        return t(
            "help-size-units-relative",
            undefined,
            "A percentage is a share of the width around the component.",
        );
    }
    if (!hasRelative) {
        return t(
            "help-size-units-absolute",
            undefined,
            "A bare number is pixels.",
        );
    }
    return t(
        "help-size-units",
        undefined,
        "A bare number is pixels. A percentage is a share of the width around the component.",
    );
}

/**
 * "Resolved function names" section surfaced when the cursor sits on
 * `additionalFunctionNames`, `removedFunctionNames`, or
 * `resetFunctionNames` of a `<mathInput>` (#1205). The author writes
 * deltas on those attributes and sees the merged effective list plus
 * the deltas they authored, so they can spot when an entry was
 * overridden or no-oped.
 *
 * When `resetFunctionNames` is authored (`breakdown.reset` present), the
 * "Reset list" row replaces the add/remove rows and a hint reminds the
 * author that the other two attributes are inactive.
 */
function renderFunctionNamesBreakdown(
    t: Translator,
    breakdown: FunctionNamesBreakdownPayload,
): React.ReactNode {
    const isReset = breakdown.reset !== undefined;
    return (
        <div className="help-detail help-function-names-breakdown">
            {renderLabeledChipList(
                t(
                    "help-resolved-function-names",
                    undefined,
                    "Resolved function names:",
                ),
                breakdown.names,
            )}
            {isReset ? (
                <>
                    {renderLabeledChipList(
                        t(
                            "help-reset-list",
                            undefined,
                            "Reset list on this input:",
                        ),
                        breakdown.reset!,
                    )}
                    <span className="help-detail-annotation">
                        {/* The three attribute names are identifiers, so they
                            are arguments rather than words in the sentence. */}
                        {t(
                            "help-reset-overrides",
                            {
                                reset: "resetFunctionNames",
                                additional: "additionalFunctionNames",
                                removed: "removedFunctionNames",
                            },
                            "resetFunctionNames overrides additionalFunctionNames and removedFunctionNames.",
                        )}
                    </span>
                </>
            ) : (
                <>
                    {breakdown.added.length > 0 &&
                        renderLabeledChipList(
                            t(
                                "help-added-on-input",
                                undefined,
                                "Added on this input:",
                            ),
                            breakdown.added,
                        )}
                    {breakdown.removed.length > 0 &&
                        renderLabeledChipList(
                            t(
                                "help-removed-on-input",
                                undefined,
                                "Removed on this input:",
                            ),
                            breakdown.removed,
                        )}
                </>
            )}
        </div>
    );
}

function formatValue(val: unknown): React.ReactNode {
    if (isMathDefaultValue(val)) {
        // `\(…\)` is the MathJax inline-math delimiter. The surrounding
        // `<MathJaxContext>` is set up at the top of `doenetml.tsx`, so we
        // can drop a `<MathJax>` directly into the help panel without
        // managing a context here.
        return (
            <MathJax
                inline
                dynamic
                hideUntilTypeset="first"
            >{`\\(${val.latex}\\)`}</MathJax>
        );
    }
    if (Array.isArray(val)) {
        // Interleave React nodes with whitespace separators rather than calling
        // `.join(" ")`, which would coerce any inner `<MathJax>` element to
        // the string `[object Object]`.
        return val.map((v, i) => (
            <React.Fragment key={i}>
                {i > 0 ? " " : null}
                {formatValue(v)}
            </React.Fragment>
        ));
    }
    if (isComponentSizeValue(val)) {
        // The schema carries a size as the runtime's `{ size, isAbsolute }`
        // pair. Printing that raw would show the author a shape they cannot
        // type back into the attribute.
        return formatComponentSize(val);
    }
    if (typeof val === "string") {
        return resolveCssVariables(val);
    }
    return JSON.stringify(val);
}

// Replace every `var(--name)` in `value` with the value currently resolved on
// `:root`, so author-facing help shows concrete colors instead of opaque CSS
// variable references. Keeps DoenetML.css as the single source of truth.
export function resolveCssVariables(value: string): string {
    if (
        typeof document === "undefined" ||
        typeof getComputedStyle !== "function" ||
        !value.includes("var(")
    ) {
        return value;
    }
    const rootStyle = getComputedStyle(document.documentElement);
    return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (match, varName) => {
        const resolved = rootStyle.getPropertyValue(varName).trim();
        return resolved || match;
    });
}
