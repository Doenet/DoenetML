import React from "react";
import { MathJax } from "better-react-mathjax";
import { parseInlineMarkdown } from "@doenet/utils/markdown/parseInlineMarkdown";
import { isMathDefaultValue } from "@doenet/static-assets/schema";
import type {
    FunctionNamesBreakdownPayload,
    HelpContent,
} from "@doenet/lsp-tools";
import "./context-help-panel.css";

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
const REFERENCES_DOC_PATH = "document_structure/references";

function ReferencesDocLink({ docsBase }: { docsBase: string }) {
    return (
        <a
            className="help-docs-link"
            href={`${docsBase}/${REFERENCES_DOC_PATH}`}
            target="_blank"
            rel="noreferrer noopener"
        >
            Learn about references →
        </a>
    );
}

export function ContextHelpPanel({
    content,
    docsURL,
}: {
    content: HelpContent;
    docsURL: string;
}) {
    // Tolerate a trailing slash on the consumer-supplied `docsURL` so that
    // e.g. "https://docs.doenet.org/" doesn't produce "//reference/..." URLs.
    const docsBase = docsURL.replace(/\/+$/, "");

    switch (content.kind) {
        case "none":
            return (
                <div className="help-panel help-panel-empty">
                    <p className="help-placeholder">
                        Place cursor on a tag name, attribute, or{" "}
                        <code>$ref.property</code> for documentation.
                    </p>
                </div>
            );

        case "unsupportedRefChain":
            return (
                <div className="help-panel help-panel-empty">
                    <p className="help-placeholder">
                        Help for multi-part references like <code>$a.b.c</code>{" "}
                        is not yet supported.
                    </p>
                </div>
            );

        case "unresolvedRef": {
            const { displayPath, reason } = content;
            const ref = <code>{`$${displayPath}`}</code>;
            // `notFound`/`multiple` are authoritative resolver verdicts;
            // `indeterminate` hedges so an incomplete-view miss is never
            // presented as a definite "no referent".
            const sentence =
                reason === "notFound" ? (
                    <>No referent found for reference: {ref}.</>
                ) : reason === "multiple" ? (
                    <>Multiple referents found for reference: {ref}.</>
                ) : (
                    <>A referent for {ref} could not be determined.</>
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
            const location =
                "elementName" in context ? (
                    <>
                        Inside <code>{`<${context.elementName}>`}</code>
                    </>
                ) : (
                    "At the top level"
                );
            // Four cases the header line discriminates:
            //   - nothing allowed at all → "<x> — nothing goes here."
            //   - text only             → "<x> — type text here."
            //   - components only       → "<x> — things to try:" (today)
            //   - text + components     → "<x> — type text here, or try:"
            const headerSuffix =
                totalAllowed === 0
                    ? acceptsStringChildren
                        ? " — type text here."
                        : " — nothing goes here."
                    : acceptsStringChildren
                      ? " — type text here, or try:"
                      : " — things to try:";
            return (
                <div className="help-panel">
                    <p className="help-suggestions-header">
                        {location}
                        {headerSuffix}
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
                                            {" — "}
                                            {renderInlineMarkdown(s.summary)}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {totalAllowed > 0 && (
                        <p className="help-suggestions-footer">
                            Press <code>Ctrl+Space</code> to see all{" "}
                            {totalAllowed} components.
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
                        {renderElementName(
                            content.elementName,
                            content.docsSlug,
                            docsBase,
                        )}
                        {" — "}
                        {renderInlineMarkdown(content.summary)}
                    </p>
                    {content.styleBreakdown &&
                        renderStyleBreakdown(content.styleBreakdown)}
                    {content.docsSlug && (
                        <a
                            className="help-docs-link"
                            href={`${docsBase}/reference/${content.docsSlug}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Reference page →
                        </a>
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
                        <code>{`$${displayPath}`}</code> is a reference to{" "}
                        <code>{`<${targetElementName}>`}</code>
                        {line !== undefined ? ` (line ${line})` : ""}.
                    </p>
                    {derivedFrom && (
                        <p className="help-ref-derived">
                            Introduced by{" "}
                            <code>{`<${derivedFrom.ownerElementName}>`}</code>
                            {derivedFrom.ownerLine !== undefined
                                ? ` on line ${derivedFrom.ownerLine}`
                                : ""}{" "}
                            as <code>{derivedFrom.role}</code>.
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
                defaultValue,
                activeDefault,
                styleBreakdown,
                functionNamesBreakdown,
            } = content;
            return (
                <div className="help-panel">
                    <div className="help-title">
                        {renderElementName(elementName, docsSlug, docsBase)}
                        <span className="help-kind-label">attribute</span>
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
                                    Default:
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
                                Active default:
                            </span>
                            <div className="help-values-list">
                                {renderActiveDefaultValue(activeDefault)}
                                <span className="help-detail-annotation">
                                    {` (styleNumber ${activeDefault.styleNumber})`}
                                </span>
                            </div>
                        </div>
                    )}
                    {styleBreakdown && renderStyleBreakdown(styleBreakdown)}
                    {functionNamesBreakdown &&
                        renderFunctionNamesBreakdown(functionNamesBreakdown)}
                    {allowedValues && allowedValues.length > 0 && (
                        <div className="help-detail help-allowed-values">
                            <span className="help-detail-label">
                                Allowed values:
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
                        <a
                            className="help-docs-link"
                            href={`${docsBase}/reference/${docsSlug}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Reference page →
                        </a>
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
                        <span className="help-kind-label">snippet</span>
                        <span className="help-snippet-name">{snippetKey}</span>
                    </div>
                    <p className="help-description">{description}</p>
                    <div className="help-detail">
                        <span className="help-detail-label">Inserts:</span>
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
                        <span className="help-kind-label">array entry</span>
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
                                {aliasPath.length === 1
                                    ? "Coordinate:"
                                    : "Coordinates:"}
                            </span>
                            <span className="help-detail-value">
                                {aliasPath.join(", ")}
                            </span>
                        </div>
                    )}
                    {leafType && (
                        <div className="help-detail">
                            <span className="help-detail-label">Type:</span>
                            <span className="help-detail-value">
                                {`<${leafType}>`}
                            </span>
                        </div>
                    )}
                    {docsSlug && (
                        <a
                            className="help-docs-link"
                            href={`${docsBase}/reference/${docsSlug}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Reference page →
                        </a>
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
                        <code>{`$${displayPath}`}</code> is a reference to the{" "}
                        <code>{propertyName}</code> property of{" "}
                        <code>{`<${elementName}>`}</code>
                        {line !== undefined ? ` (line ${line})` : ""}.
                    </p>
                    <p className="help-description">
                        {renderInlineMarkdown(description)}
                    </p>
                    {type !== undefined && (
                        <div className="help-detail">
                            <span className="help-detail-label">Type:</span>
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
function renderStyleBreakdown(breakdown: {
    styleNumber: number;
    entries: Array<{
        key: string;
        value: string | number | boolean;
        colorWord?: string;
    }>;
}): React.ReactNode {
    return (
        <div className="help-detail help-style-breakdown">
            <span className="help-detail-label">
                {`Resolved style (styleNumber ${breakdown.styleNumber}):`}
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
 * Render a label + chip-list pair used by the function-names breakdown
 * section. Each chip is a `help-value-item` pill and the chips wrap via
 * the parent `help-values-list` flex row.
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
    breakdown: FunctionNamesBreakdownPayload,
): React.ReactNode {
    const isReset = breakdown.reset !== undefined;
    return (
        <div className="help-detail help-function-names-breakdown">
            {renderLabeledChipList("Resolved function names:", breakdown.names)}
            {isReset ? (
                <>
                    {renderLabeledChipList(
                        "Reset list on this input:",
                        breakdown.reset!,
                    )}
                    <span className="help-detail-annotation">
                        {
                            "resetFunctionNames overrides additionalFunctionNames and removedFunctionNames."
                        }
                    </span>
                </>
            ) : (
                <>
                    {breakdown.added.length > 0 &&
                        renderLabeledChipList(
                            "Added on this input:",
                            breakdown.added,
                        )}
                    {breakdown.removed.length > 0 &&
                        renderLabeledChipList(
                            "Removed on this input:",
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
        // Interleave React nodes with comma separators rather than calling
        // `.join(", ")`, which would coerce any inner `<MathJax>` element to
        // the string `[object Object]`.
        return val.map((v, i) => (
            <React.Fragment key={i}>
                {i > 0 ? ", " : null}
                {formatValue(v)}
            </React.Fragment>
        ));
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
