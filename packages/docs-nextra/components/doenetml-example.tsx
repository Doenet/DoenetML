import React from "react";
import { IframeDoenetML } from "./iframe-doenetml";
import { Tabs } from "nextra/components";

/**
 * Render DoenetML as an example in documentation.
 */
export function DoenetMLExample({ children }: React.PropsWithChildren<{}>) {
    if (typeof children !== "string") {
        console.error(
            "Error with DoenetML component. Expected a string child containing DoenetML source code, but found",
            children,
        );
        return (
            <div className="docs-error">
                <em>Error with DoenetML component.</em> Expected a string child
                containing DoenetML source code, but found {typeof children}.
                Check the console for details
            </div>
        );
    }
    const source = children.trim();
    return (
        <div className="doenetml-example-container">
            <Tabs items={["Example", "Source"]} defaultIndex={0}>
                <Tabs.Tab>
                    <div className="doenetml-example">
                        <IframeDoenetML>{source}</IframeDoenetML>
                    </div>
                </Tabs.Tab>
                <Tabs.Tab>
                    <pre className="doenetml-source">{source}</pre>
                </Tabs.Tab>
            </Tabs>
        </div>
    );
}
