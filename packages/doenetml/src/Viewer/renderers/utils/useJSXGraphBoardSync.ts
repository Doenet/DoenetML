// @ts-nocheck
import { useEffect } from "react";
import useGridAndAxesSync from "./useGridAndAxesSync";
import useViewportAndNavigationSync from "./useViewportAndNavigationSync";

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
}) {
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
