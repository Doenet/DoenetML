import { Link } from "nextra-theme-docs";
import React from "react";

export type PropAttrType =
    | "title"
    | "text"
    | "keyword"
    | "boolean"
    | "math"
    | "integer"
    | "number"
    | "textList"
    | "point";

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
};

export type PropInfo = {
    /** Name of the prop */
    name: string;
    /** Type of the prop */
    type: PropAttrType;
    /** Whether this prop is common to all components (like `hide`) */
    common: boolean;
    /** Author-facing description of the prop */
    description: string;
    /** Whether the prop accepts an array of values */
    isArray?: boolean;
};

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
    attrs.sort((a, b) => a.name.localeCompare(b.name));
    const componentAttrs = attrs.filter((attr) => !attr.common);

    return (
        <div className="attr-list" id="attr-list">
            <h3 className="attr-list-caption">
                Attributes for{" "}
                {children || (
                    <code>
                        {"<"}
                        {name}
                        {">"}
                    </code>
                )}
            </h3>
            {componentAttrs.map((attr) => {
                const linkTarget = links[attr.name];
                const nameElm = linkTarget ? (
                    <Link href={linkTarget}>{attr.name}</Link>
                ) : (
                    attr.name
                );
                const typeLabel = formatType(attr.type, attr.isArray);
                const isKeyword = attr.type === "keyword";
                const defaultStr = formatDefaultValue(attr.defaultValue);
                // `boolean` attributes only ever take true/false, so the
                // value table would be noise — skip it for them.
                const showValues =
                    attr.type !== "boolean" &&
                    attr.values != null &&
                    attr.values.length > 0;
                return (
                    <div className="attr-item" key={attr.name}>
                        <div>
                            <code className="attr-name attr-name-box">
                                {nameElm}
                            </code>
                        </div>
                        <p className="attr-detail">
                            {typeLabel ? (
                                <>
                                    <em className="attr-type">{typeLabel}</em>
                                    .{" "}
                                </>
                            ) : null}
                            {/* The default value follows the type, except for
                                keyword attributes, where it is marked in the
                                value list below. */}
                            {!isKeyword && defaultStr !== null ? (
                                <>
                                    Default value:{" "}
                                    <code className="attr-default">
                                        {defaultStr}
                                    </code>
                                    .{" "}
                                </>
                            ) : null}
                            {attr.description}
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
                                            String(attr.defaultValue) ===
                                                v.value;
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
                                                <td>{v.description || ""}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : null}
                    </div>
                );
            })}
        </div>
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
    props.sort((a, b) => a.name.localeCompare(b.name));
    const componentProps = props.filter((prop) => !prop.common);
    const refName = name.charAt(0).toLowerCase();

    return (
        <div className="prop-list" id="prop-list">
            <h3 className="prop-list-caption">
                Props for{" "}
                {children || (
                    <code>
                        {"<"}
                        {name} name="{refName}"{">"}
                    </code>
                )}
            </h3>
            {componentProps.map((prop) => {
                const linkTarget = links[prop.name];
                const nameElm = linkTarget ? (
                    <Link href={linkTarget}>{prop.name}</Link>
                ) : (
                    prop.name
                );
                const typeLabel = formatType(prop.type, prop.isArray);
                return (
                    <div className="prop-item" key={prop.name}>
                        <div>
                            <code className="prop-name-box">
                                ${refName}.
                                <span className="prop-name">{nameElm}</span>
                            </code>
                        </div>
                        <p className="prop-detail">
                            {typeLabel ? (
                                <>
                                    <em className="prop-type">{typeLabel}</em>
                                    .{" "}
                                </>
                            ) : null}
                            {prop.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

/**
 * Renders the body of an "Attributes and Properties" section: the attribute
 * list and the property list, substituting a short message for either one
 * when the component has none. The section heading itself is emitted as a
 * real Markdown heading by the `autoInsertAttrPropDescriptions` remark plugin.
 */
export function AttrPropDisplay({
    name,
    attrs = [],
    props = [],
    links = {},
}: {
    name: string;
    attrs?: AttrInfo[];
    props?: PropInfo[];
    links?: Record<string, string>;
}) {
    const hasAttrs = attrs.some((attr) => !attr.common);
    const hasProps = props.some((prop) => !prop.common);
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
        <>
            {hasAttrs ? (
                <AttrDisplay name={name} attrs={attrs} links={links} />
            ) : (
                <p>The {nameCode} component has no attributes.</p>
            )}
            {hasProps ? (
                <PropDisplay name={name} props={props} links={links} />
            ) : (
                <p>The {nameCode} component has no properties.</p>
            )}
        </>
    );
}

/**
 * Format a type for display, putting `[…]` around it if it's an array.
 */
function formatType(typeName?: PropAttrType, isArray?: boolean) {
    if (!typeName) {
        return null;
    }
    return isArray ? `[ ${typeName} ]` : typeName;
}

/**
 * Format an attribute's default value for display. Returns `null` when there
 * is no meaningful default (`null`/`undefined`), so callers can omit it.
 */
function formatDefaultValue(value: unknown): string | null {
    if (value == null) {
        return null;
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
