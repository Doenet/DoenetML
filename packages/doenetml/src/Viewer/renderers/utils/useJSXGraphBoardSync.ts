import { useEffect, type CSSProperties, type RefObject } from "react";
import useGridAndAxesSync from "./useGridAndAxesSync";
import useViewportAndNavigationSync from "./useViewportAndNavigationSync";
import type { AxisJXG } from "./jsxgraph";
import type { JXGBoard } from "../jsxgraph-distrib/types";
import type { GraphSVs } from "../graph";

interface PreviousDimensions {
    width: number;
    aspectRatio: string | number;
}

interface UseJSXGraphBoardSyncParams {
    board: JXGBoard | null;
    id: string;
    SVs: GraphSVs;
    ignoreUpdate: boolean;
    showNavigation: boolean;
    surfaceStyle: CSSProperties;
    previousDimensionsRef: RefObject<PreviousDimensions>;
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
    surfaceStyle,
    previousDimensionsRef,
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
        enabled,
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
        surfaceStyle,
        previousDimensionsRef,
        previousBoundingboxRef,
        settingBoundingBoxRef,
        previousShowNavigationRef,
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
