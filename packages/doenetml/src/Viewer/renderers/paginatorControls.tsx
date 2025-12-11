import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { Button } from "@doenet/ui-components";

export default React.memo(function PaginatorControls(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } = useDoenetRenderer(props, false);

    if (SVs.hidden) {
        return null;
    }

    return (
        <div id={id}>
            <div id={id} style={{ display: "inline-block", margin: "12px 0" }}>
                <Button
                    id={id + "_previous"}
                    onClick={() => {
                        callAction({
                            action: actions.setPage,
                            args: { number: SVs.currentPage - 1 },
                        });
                    }}
                    disabled={SVs.disabledDirectly || !(SVs.currentPage > 1)}
                    value={SVs.previousLabel}
                />
            </div>
            {" " + SVs.pageLabel} {SVs.currentPage} of {SVs.numPages + " "}
            <div id={id} style={{ display: "inline-block", margin: "12px 0" }}>
                <Button
                    id={id + "_next"}
                    onClick={() => {
                        callAction({
                            action: actions.setPage,
                            args: { number: SVs.currentPage + 1 },
                        });
                    }}
                    disabled={
                        SVs.disabledDirectly ||
                        !(SVs.currentPage < SVs.numPages)
                    }
                    value={SVs.nextLabel}
                />
            </div>
        </div>
    );
});
