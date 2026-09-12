import { useEffect, type RefObject } from "react";
import useAxisTickSpacingSync from "./useAxisTickSpacingSync";
import useGridAndAxesSync from "./useGridAndAxesSync";
import useViewportAndNavigationSync from "./useViewportAndNavigationSync";
import type { AxisJXG } from "./jsxgraph";
import type { JXGBoard } from "../jsxgraph-distrib/types";
import type { GraphSVs } from "../graph";

interface UseJSXGraphBoardSyncParams {
    board: JXGBoard | null;
    id: string;
    SVs: GraphSVs;
    ignoreUpdate: boolean;
    showNavigation: boolean;
    previousBoundingboxRef: RefObject<number[]>;
    xaxisRef: RefObject<AxisJXG | null | undefined>;
    yaxisRef: RefObject<AxisJXG | null | undefined>;
    settingBoundingBoxRef: RefObject<boolean>;
    boardJustInitializedRef: RefObject<boolean>;
    previousShowNavigationRef: RefObject<boolean>;
    previousXaxisWithLabelRef: RefObject<boolean>;
    previousYaxisWithLabelRef: RefObject<boolean>;
}

export default function useJSXGraphBoardSync({
    board,
    id,
    SVs,
    ignoreUpdate,
    showNavigation,
    previousBoundingboxRef,
    xaxisRef,
    yaxisRef,
    settingBoundingBoxRef,
    boardJustInitializedRef,
    previousShowNavigationRef,
    previousXaxisWithLabelRef,
    previousYaxisWithLabelRef,
}: UseJSXGraphBoardSyncParams) {
    const enabled = Boolean(board) && !boardJustInitializedRef.current;

    useGridAndAxesSync({
        enabled: Boolean(board),
        board,
        SVs,
        xaxisRef,
        yaxisRef,
        previousXaxisWithLabelRef,
        previousYaxisWithLabelRef,
    });

    useViewportAndNavigationSync({
        enabled,
        board,
        id,
        SVs,
        ignoreUpdate,
        showNavigation,
        previousBoundingboxRef,
        settingBoundingBoxRef,
        previousShowNavigationRef,
    });

    // Declared last on purpose: tick spacing follows from the bounding box, so
    // it is read only once the viewport sync above has applied it.
    useAxisTickSpacingSync({
        enabled,
        board,
        xaxisRef,
        yaxisRef,
    });

    useEffect(() => {
        if (!board) {
            return;
        }

        if (boardJustInitializedRef.current) {
            boardJustInitializedRef.current = false;
        }
    });
}
