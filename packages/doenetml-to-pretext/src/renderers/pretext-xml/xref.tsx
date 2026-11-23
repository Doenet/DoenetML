import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { XrefPropsInText } from "@doenet/doenetml-worker";
import { normalizeAttrs } from "../../utils/pretext/normalize-attrs";

/**
 * Where a `<ref to="doenet:<id>">` points, matching the viewer's default
 * `doenetViewerUrl` (see `getURLFromRef` in the viewer's `ref` renderer).
 */
const DOENET_VIEWER_URL = "https://doenet.org/activityViewer";

/**
 * The props a `<ref>` arrives with: a `referent` when its target is a rendered
 * component of this document, and core's `url` (and, for a `doenet:` URI, the
 * `activityId` and `activityUrlPostfix`) of what it links to.
 */
type RefProps = XrefPropsInText & {
    url?: string;
    activityId?: string;
    activityUrlPostfix?: string;
};

export const Xref: BasicComponentWithPassthroughChildren<{
    props: RefProps;
}> = ({ children, node }) => {
    const { referent, url, activityId, activityUrlPostfix } = node.data.props;

    if (referent == null) {
        // Not a link within the document: an external link is a PreTeXt `<url>`.
        // With no children, PreTeXt shows the address itself. A `#` address
        // (a target not found or not rendered, or an authored `#anchor`) has
        // no PreTeXt id to link to, so it stays an `<xref>` below and PreTeXt
        // reports the missing target.
        const href = activityId
            ? `${DOENET_VIEWER_URL}/${activityId}${activityUrlPostfix ?? ""}`
            : url;
        if (href && !href.startsWith("#")) {
            return React.createElement(
                "url",
                { href },
                <React.Fragment>{children}</React.Fragment>,
            );
        }
    }

    const referentHtmlId = `doenet-id-${referent}`;

    return React.createElement(
        "xref",
        normalizeAttrs({ ref: referentHtmlId }),
        <React.Fragment>{children}</React.Fragment>,
    );
};
