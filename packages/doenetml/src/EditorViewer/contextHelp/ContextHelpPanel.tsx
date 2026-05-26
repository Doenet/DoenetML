import React from "react";
import { MathJax } from "better-react-mathjax";
import { parseInlineMarkdown } from "@doenet/utils/markdown/parseInlineMarkdown";
import { isMathDefaultValue } from "@doenet/static-assets/schema";
import { HelpContent } from "@doenet/lsp-tools";
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

        case "element":
            return (
                <div className="help-panel">
                    <div className="help-title">
                        <span className="help-element-name">
                            {`<${content.elementName}>`}
                        </span>
                    </div>
                    <p className="help-description">
                        {renderInlineMarkdown(content.summary)}
                    </p>
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
            const {
                displayPath,
                targetElementName,
                summary,
                line,
                docsSlug,
                derivedFrom,
            } = content;
            return (
                <div className="help-panel">
                    <p className="help-ref-sentence">
                        <code>{`$${displayPath}`}</code> references{" "}
                        <code>{`<${targetElementName}>`}</code>
                        {line !== undefined ? ` on line ${line}` : ""}.
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
                    {summary && (
                        <p className="help-description">
                            {renderInlineMarkdown(summary)}
                        </p>
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

        case "attribute": {
            const {
                elementName,
                attributeName,
                description,
                docsSlug,
                allowedValues,
                defaultValue,
                activeDefault,
            } = content;
            return (
                <div className="help-panel">
                    <div className="help-title">
                        <span className="help-element-name">
                            {`<${elementName}>`}
                        </span>
                        <span className="help-kind-label">attribute</span>
                        <span className="help-attribute-name">
                            {attributeName}
                        </span>
                    </div>
                    <p className="help-description">
                        {renderInlineMarkdown(description)}
                    </p>
                    {defaultValue !== undefined && defaultValue !== null && (
                        <div className="help-detail">
                            <span className="help-detail-label">Default:</span>
                            <div className="help-values-list">
                                <span className="help-value-item">
                                    {formatValue(defaultValue)}
                                </span>
                            </div>
                        </div>
                    )}
                    {activeDefault && (
                        // Surfaces the styleDefinition-resolved value the
                        // attribute inherits at this cursor scope (#1198).
                        // Rendered as a separate row from "Default:" so the
                        // author can tell at a glance which signal is the
                        // static schema fallback vs. the live inherited
                        // value. The styleNumber annotation lets them trace
                        // the value back to the ancestor that supplied it.
                        <div className="help-detail">
                            <span className="help-detail-label">
                                Active default:
                            </span>
                            <div className="help-values-list">
                                <span className="help-value-item">
                                    {formatValue(activeDefault.value)}
                                </span>
                                <span className="help-detail-annotation">
                                    {` (styleNumber ${activeDefault.styleNumber})`}
                                </span>
                            </div>
                        </div>
                    )}
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
                        <span className="help-element-name">
                            {`<${elementName}>`}
                        </span>
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
                docsSlug,
                type,
                isArray,
            } = content;
            return (
                <div className="help-panel">
                    <div className="help-title">
                        <span className="help-element-name">
                            {`<${elementName}>`}
                        </span>
                        <span className="help-kind-label">property</span>
                        <span className="help-property-name">
                            {propertyName}
                        </span>
                    </div>
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
    }
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
