import React from "react";
import { parseInlineMarkdown } from "@doenet/utils/markdown/parseInlineMarkdown";
import { HelpContent } from "./types";
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
            const { refName, targetElementName, summary, line, docsSlug } =
                content;
            return (
                <div className="help-panel">
                    <p className="help-ref-sentence">
                        <code>{`$${refName}`}</code> references{" "}
                        <code>{`<${targetElementName}>`}</code>
                        {line !== undefined ? ` on line ${line}` : ""}.
                    </p>
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
                    {allowedValues && allowedValues.length > 0 && (
                        <div className="help-detail">
                            <span className="help-detail-label">
                                Allowed values:
                            </span>
                            <div className="help-values-list">
                                {allowedValues.map((val, idx) => (
                                    <span key={idx} className="help-value-item">
                                        {formatValue(val)}
                                    </span>
                                ))}
                            </div>
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

function formatValue(val: unknown): string {
    if (Array.isArray(val)) {
        return val.map((v) => formatValue(v)).join(", ");
    }
    if (typeof val === "string") {
        return val;
    }
    return JSON.stringify(val);
}
