// @ts-nocheck
import { useEffect } from "react";
import { addNavigationButtons, removeNavigationButtons } from "./jsxgraph";

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
}) {
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
        const currentDimensions = {
            width: parseFloat(surfaceStyle.width),
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
