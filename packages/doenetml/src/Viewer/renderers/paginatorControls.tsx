import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { Button } from "@doenet/ui-components";

interface PaginatorControlsSVs {
    [key: string]: any;
    hidden: boolean;
    currentPage: number;
    disabledDirectly: boolean;
    nextLabel: string;
    numPages: number;
    pageStatus: string;
    previousLabel: string;
}

export default React.memo(function PaginatorControls(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, actions, callAction } =
        useDoenetRenderer<PaginatorControlsSVs>(props, false);

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
            {/* The whole status is composed in the worker, in the document's
                language, so that the author's own `pageLabel` and the words
                around it are never in two different languages. */}
            {" " + SVs.pageStatus + " "}
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
