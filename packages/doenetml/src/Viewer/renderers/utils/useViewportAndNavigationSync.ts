import { useEffect, type RefObject } from "react";
import { addNavigationButtons, removeNavigationButtons } from "./jsxgraph";
import type { JXGBoard } from "../jsxgraph-distrib/types";
import type { GraphSVs } from "../graph";

interface UseViewportAndNavigationSyncParams {
    enabled: boolean;
    board: JXGBoard | null;
    id: string;
    SVs: GraphSVs;
    ignoreUpdate: boolean;
    showNavigation: boolean;
    previousBoundingboxRef: RefObject<number[]>;
    settingBoundingBoxRef: RefObject<boolean>;
    previousShowNavigationRef: RefObject<boolean>;
}

export default function useViewportAndNavigationSync({
    enabled,
    board,
    id,
    SVs,
    ignoreUpdate,
    showNavigation,
    previousBoundingboxRef,
    settingBoundingBoxRef,
    previousShowNavigationRef,
}: UseViewportAndNavigationSyncParams) {
    useEffect(() => {
        if (!enabled || !board) {
            return;
        }

        // Keep zoom/pan interaction mode in sync with fixAxes.
        board.attr.zoom.wheel = !SVs.fixAxes;
        board.attr.pan.enabled = !SVs.fixAxes;

        // Toggle JSXGraph navigation controls only when state changes.
        if (showNavigation) {
            if (!previousShowNavigationRef.current) {
                addNavigationButtons({ board, id });
                previousShowNavigationRef.current = true;
            }
        } else if (previousShowNavigationRef.current) {
            removeNavigationButtons({ board, id });
            previousShowNavigationRef.current = false;
        }

        // Apply bounding-box updates only when not ignored and values changed.
        if (!ignoreUpdate) {
            const boundingbox = [SVs.xMin, SVs.yMax, SVs.xMax, SVs.yMin];

            if (
                boundingbox.some(
                    (v, i) => v !== previousBoundingboxRef.current[i],
                )
            ) {
                settingBoundingBoxRef.current = true;
                board.setBoundingBox(boundingbox);
                settingBoundingBoxRef.current = false;
                board.fullUpdate();

                if (board.updateQuality === board.BOARD_QUALITY_LOW) {
                    board.itemsRenderedLowQuality[id] = board;
                }

                previousBoundingboxRef.current = boundingbox;
            }
        }
    });
}
