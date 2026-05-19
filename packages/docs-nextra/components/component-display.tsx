import React from "react";

export type ComponentInfo = {
    /** Name of the DoenetML component */
    name: string;
    /** One-sentence summary of what the component does */
    summary: string;
};

/**
 * Displays schema-derived information about a DoenetML component. Currently
 * just the component summary; the `name`/`summary` props are filled in at
 * build time by the `autoInsertAttrPropDescriptions` remark plugin from the
 * `name` attribute, so reference pages only need `<ComponentDisplay name='…'/>`.
 */
export function ComponentDisplay({
    name,
    summary,
    children,
}: React.PropsWithChildren<{ name: string; summary?: string }>) {
    if (!summary && !children) {
        return null;
    }
    return (
        <div
            className="component-summary"
            id="component-summary"
            data-name={name}
        >
            {children || summary}
        </div>
    );
}
