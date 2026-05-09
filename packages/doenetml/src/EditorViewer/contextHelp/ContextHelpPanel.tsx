import React from "react";
import { HelpContent } from "./types";
import "./context-help-panel.css";

export function ContextHelpPanel({
    content,
    docsURL,
}: {
    content: HelpContent;
    docsURL: string;
}) {
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

        case "element":
            return (
                <div className="help-panel">
                    <div className="help-title">
                        <span className="help-element-name">
                            {`<${content.elementName}>`}
                        </span>
                    </div>
                    <p className="help-description">{content.summary}</p>
                    {content.docsSlug && (
                        <a
                            className="help-docs-link"
                            href={`${docsURL}/reference/${content.docsSlug}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Reference page →
                        </a>
                    )}
                </div>
            );

        case "attribute": {
            const {
                elementName,
                attributeName,
                description,
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
                    <p className="help-description">{description}</p>
                    {defaultValue !== undefined && (
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
                </div>
            );
        }

        case "property": {
            const { elementName, propertyName, description, type, isArray } =
                content;
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
                    <p className="help-description">{description}</p>
                    {type !== undefined && (
                        <div className="help-detail">
                            <span className="help-detail-label">Type:</span>
                            <span className="help-detail-value">
                                {`<${type}>`}
                                {isArray ? "[]" : ""}
                            </span>
                        </div>
                    )}
                </div>
            );
        }
    }
}

function formatValue(val: unknown): string {
    // `null` is a meaningful default for many attributes (e.g. <slider>
    // initialValue) — display it as a human-readable "(none)" rather than
    // the JSON-stringified literal.
    if (val === null) {
        return "(none)";
    }
    if (Array.isArray(val)) {
        return val.map((v) => formatValue(v)).join(", ");
    }
    if (typeof val === "string") {
        return val;
    }
    return JSON.stringify(val);
}
