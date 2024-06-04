import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";
import type { XrefProps } from "@doenet/doenetml-worker-rust";

export const Xref: BasicComponentWithPassthroughChildren<{
    props: XrefProps;
}> = ({ children, node }) => {
    const referentHtmlId = `doenet-id-${node.data.props.referent}`;
    const label = node.data.props.displayText;
    // XXX: when knowls get figured out, make this code generate a knowl in the correct place.
    //const referentContent = node.data.props.referentChildren;
    //let hasReferentContent = referentContent.length > 0;
    //
    //if (hasReferentContent) {
    //    return <details>
    //        <summary>
    //            <a className="xref" href={`#${referentHtmlId}`}>
    //                {children}
    //                {label}
    //            </a>
    //        </summary>
    //        {referentContent.map(c => typeof c === "string" ? c : <Element id={c} />)}
    //    </details>;
    //}

    return (
        <a className="xref" href={`#${referentHtmlId}`}>
            {children}
            {label}
        </a>
    );
};
