import React from "react";

//import { renderDoenetToContainer } from "doenet-standalone-test";

export function DoenetInternal({children}) {
console.log(children)
    return (
        <div
            ref={(domNode) => {
                if (domNode) {
                    console.log("rendering the doenet");
                    window.renderDoenetToContainer(domNode, children || "");
                }
            }}
        >
        </div>
    );
}

export default DoenetInternal;
