import { useEffect, type CSSProperties, type RefObject } from "react";
import { addNavigationButtons, removeNavigationButtons } from "./jsxgraph";
import type { JXGBoard } from "../jsxgraph-distrib/types";
import type { GraphSVs } from "../graph";

interface PreviousDimensions {
    width: number;
    aspectRatio: string | number;
}

interface UseViewportAndNavigationSyncParams {
    enabled: boolean;
    board: JXGBoard | null;
    id: string;
    SVs: GraphSVs;
    ignoreUpdate: boolean;
    showNavigation: boolean;
    surfaceStyle: CSSProperties;
    previousDimensionsRef: RefObject<PreviousDimensions>;
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
    surfaceStyle,
    previousDimensionsRef,
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

        // Track surface dimensions to preserve existing resize semantics.
        const currentDimensions: PreviousDimensions = {
            width: parseFloat(surfaceStyle.width as string),
            aspectRatio: SVs.aspectRatio,
        };

        if (
            (currentDimensions.width !== previousDimensionsRef.current.width ||
                currentDimensions.aspectRatio !==
                    previousDimensionsRef.current.aspectRatio) &&
            Number.isFinite(currentDimensions.width) &&
            Number.isFinite(currentDimensions.aspectRatio)
        ) {
            previousDimensionsRef.current = currentDimensions;
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
