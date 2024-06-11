import { Link } from "nextra-theme-docs";
import React from "react";

export type PropAttrType =
    | "title"
    | "text"
    | "boolean"
    | "math"
    | "integer"
    | "number"
    | "textList"
    | "point";

export type AttrInfo = {
    /** Name of the attribute */
    name: string;
    /** Type of the attribute */
    type?: PropAttrType;
    /** Whether this attribute is common to all components (like `hide`) */
    common: boolean;
    /** Explicit values that the attribute may take */
    values?: string[];
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
    const commonAttrs = attrs.filter((attr) => attr.common);
    const componentAttrs = attrs.filter((attr) => !attr.common);

    return (
        <table className="attr-table" id="attr-list">
            <caption>
                Attributes for{" "}
                {children || (
                    <code>
                        {"<"}
                        {name}
                        {">"}
                    </code>
                )}
            </caption>
            <thead>
                <tr>
                    <th>Attribute</th>
                    <th>Type</th>
                    <th>Values</th>
                </tr>
            </thead>
            <tbody>
                {componentAttrs.map((attr) => {
                    const linkTarget = links[attr.name];
                    const nameElm = linkTarget ? (
                        <Link href={linkTarget}>{attr.name}</Link>
                    ) : (
                        attr.name
                    );
                    return (
                        <tr key={attr.name}>
                            <td>
                                <code>
                                    <span className="attr-name">{nameElm}</span>
                                     = "…"
                                </code>
                            </td>
                            <td className="attr-type">
                                {formatType(attr.type, attr.isArray)}
                            </td>
                            <td className="attr-values">
                                {attr.values?.map((v) => (
                                    <React.Fragment key={v}>
                                        <code className="attr-value">
                                            "{v}"
                                        </code>{" "}
                                    </React.Fragment>
                                )) || ""}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
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
    const commonProps = props.filter((attr) => attr.common);
    const componentProps = props.filter((attr) => !attr.common);
    const refName = name.charAt(0).toLowerCase();

    return (
        <table className="prop-table" id="prop-list">
            <caption>
                Props for{" "}
                {children || (
                    <code>
                        {"<"}
                        {name} name="{refName}"{">"}
                    </code>
                )}
            </caption>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {componentProps.map((prop) => {
                    const linkTarget = links[prop.name];
                    const nameElm = linkTarget ? (
                        <Link href={linkTarget}>{prop.name}</Link>
                    ) : (
                        prop.name
                    );
                    return (
                        <tr key={prop.name}>
                            <td>
                                <code>
                                    ${refName}.
                                    <span className="prop-name">{nameElm}</span>
                                </code>
                            </td>
                            <td className="prop-type">
                                {formatType(prop.type, prop.isArray)}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
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
