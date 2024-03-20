import React from "react";

import { renderDoenetToContainer } from "@doenet/standalone";

export function MyCounter({children}) {
console.log(children)
    return (
        <div
            ref={(domNode) => {
                if (domNode) {
                    console.log("rendering the doenet");
                    renderDoenetToContainer(domNode, domNode.textContent || "");
                }
            }}
        >
            {`<p>The component</p>
        <graph>
            <point />
        </graph>`}
        </div>
    );
}

export default MyCounter;
