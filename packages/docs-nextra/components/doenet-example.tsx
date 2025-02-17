import React from "react";
import { DoenetViewer } from "./doenet";
import { Tabs } from "nextra/components";

/**
 * Render DoenetML as an example in documentation.
 */
export function DoenetExample({
    source,
    children,
}: React.PropsWithChildren<{ source: string }>) {
    return (
        <div className="doenet-example-container">
            <Tabs items={["Example", "Source"]} defaultIndex={0}>
                <Tabs.Tab>
                    <div className="doenetml-example">
                        <DoenetViewer source={source} />
                    </div>
                </Tabs.Tab>
                <Tabs.Tab>{children}</Tabs.Tab>
            </Tabs>
        </div>
    );
}
