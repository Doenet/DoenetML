import { MathJax } from "better-react-mathjax";
import React, { useEffect } from "react";
import useDoenetRender from "./useDoenetRenderer";

export default React.memo(function Number(props) {
    let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

    if (SVs.hidden) {
        return null;
    }

    let number = SVs.text;
    if (SVs.renderAsMath) {
        number = "\\(" + number + "\\)";
    }
    return (
        <>
            <a name={name} />
            <span id={name}>
                <MathJax hideUntilTypeset={"first"} inline dynamic>
                    {number}
                </MathJax>
            </span>
        </>
    );
});
