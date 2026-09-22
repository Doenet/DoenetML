import React from "react";
import { SinceBadge } from "./since-badge";

export type ComponentInfo = {
    /** Name of the DoenetML component */
    name: string;
    /** One-sentence summary of what the component does */
    summary: string;
};

/**
 * Displays schema-derived information about a DoenetML component: its summary
 * and, when there is one, the release it arrived in. The `name`/`summary`/`since`
 * props are filled in at build time by the `autoInsertAttrPropDescriptions`
 * remark plugin from the `name` attribute, so reference pages only need
 * `<ComponentDisplay name='…'/>`.
 *
 * The element's badge also stands in for its attributes and properties: those
 * that arrived with it carry none of their own, so a component new in 0.7.27
 * reads as one new component and not as a badge on each of its members.
 */
export function ComponentDisplay({
    name,
    summary,
    since,
    children,
}: React.PropsWithChildren<{
    name: string;
    summary?: string;
    since?: string;
}>) {
    const body = children || summary;
    if (!body && !since) {
        return null;
    }
    return (
        <div
            className="component-summary"
            id="component-summary"
            data-name={name}
            data-since={since}
        >
            {body}
            <SinceBadge since={since} />
        </div>
    );
}
