import { useContext } from "react";
import { DocContext } from "../../DocViewer";
import type { SourceNavigationConfig } from "./lineFamilyDragHandlers";

/**
 * Build the `sourceNavigation` config a line-family renderer passes to
 * `attachLineFamilyDragHandlers`: the renderer's DOM id paired with the
 * viewer's `reportGraphElementUp` callback from `DocContext`, or
 * `undefined` when the viewer has no click-to-navigate wiring (so the drag
 * handlers skip reporting entirely).
 */
export function useSourceNavigation(
    domId: string,
): SourceNavigationConfig | undefined {
    const { reportGraphElementUp } = useContext(DocContext);
    return reportGraphElementUp
        ? { domId, report: reportGraphElementUp }
        : undefined;
}
