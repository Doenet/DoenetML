import React from "react";

//import { renderDoenetToContainer } from "doenet-standalone-test";
declare module window {
    function renderDoenetToContainer(
        domNode: HTMLElement,
        content: string,
    ): void;
}

export function DoenetInternal({ children }: React.PropsWithChildren<{}>) {
    return (
        <div
            ref={(domNode) => {
                if (domNode) {
                    console.log("rendering the doenet");
                    window.renderDoenetToContainer(
                        domNode,
                        String(children || ""),
                    );
                }
            }}
        ></div>
    );
}

export default DoenetInternal;
