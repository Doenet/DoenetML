import React from "react";
import PointControlsFamily from "./families/PointControlsFamily";
import CircleControlsFamily from "./families/CircleControlsFamily";
import PolygonControlsFamily from "./families/PolygonControlsFamily";
import TriangleControlsFamily from "./families/TriangleControlsFamily";
import RegularPolygonControlsFamily from "./families/RegularPolygonControlsFamily";
import RectangleControlsFamily from "./families/RectangleControlsFamily";
import LineSegmentControlsFamily from "./families/LineSegmentControlsFamily";
import VectorControlsFamily from "./families/VectorControlsFamily";
import {
    assertKnownGraphControlType,
    type GraphControlItem,
    type GraphControlsFamilyProps,
    selectInitialExpandedGraphControlIds,
    sortGraphControlsForDisplay,
} from "./model";

const CONTROLS_FAMILY_BY_TYPE: Record<
    GraphControlItem["controlType"],
    React.ComponentType<GraphControlsFamilyProps>
> = {
    point: PointControlsFamily,
    circle: CircleControlsFamily,
    polygon: PolygonControlsFamily,
    triangle: TriangleControlsFamily,
    regularPolygon: RegularPolygonControlsFamily,
    rectangle: RectangleControlsFamily,
    lineSegment: LineSegmentControlsFamily,
    vector: VectorControlsFamily,
};

export default React.memo(function GraphControlsRoot(
    props: GraphControlsFamilyProps,
) {
    const { id, SVs } = props;

    const orderedControls = React.useMemo(
        () => sortGraphControlsForDisplay(SVs.graphicalDescendantsForControls),
        [SVs.graphicalDescendantsForControls],
    );

    const defaultExpandedControlIds = React.useMemo(
        () => selectInitialExpandedGraphControlIds(orderedControls),
        [orderedControls],
    );

    const [expandedByControlId, setExpandedByControlId] = React.useState(() => {
        const initialMap = new Map<number, boolean>();
        for (const control of orderedControls) {
            initialMap.set(
                control.componentIdx,
                defaultExpandedControlIds.has(control.componentIdx),
            );
        }
        return initialMap;
    });

    /**
     * Sync expansion state map whenever the ordered controls list or defaults change.
     * Handles four cases:
     * 1. New controls: inherit the default expanded state
     * 2. Removed controls: drop their expansion state (unreachable now)
     * 3. Reordered controls: preserve user's expansion state by componentIdx
     * 4. Unchanged: return previous state to avoid spurious re-renders
     */
    React.useEffect(() => {
        setExpandedByControlId((previous) => {
            const next = new Map<number, boolean>();
            let changed = previous.size !== orderedControls.length;

            for (const control of orderedControls) {
                const componentIdx = control.componentIdx;
                const previousValue = previous.get(componentIdx);
                const nextValue =
                    previousValue ??
                    defaultExpandedControlIds.has(componentIdx);
                next.set(componentIdx, nextValue);
                if (previousValue === undefined) {
                    changed = true;
                }
            }

            if (!changed) {
                for (const [componentIdx, value] of previous) {
                    if (next.get(componentIdx) !== value) {
                        changed = true;
                        break;
                    }
                }
            }

            return changed ? next : previous;
        });
    }, [orderedControls, defaultExpandedControlIds]);

    /**
     * Query whether a control card is currently expanded.
     * Checks the user-controlled state first, falling back to the default initial state.
     * This allows controls to remain collapsed/expanded as the user set them, even as
     * the list of controls changes (e.g., due to visibility constraints).
     */
    const isGraphControlExpanded = React.useCallback(
        (componentIdx: number) =>
            expandedByControlId.get(componentIdx) ??
            defaultExpandedControlIds.has(componentIdx),
        [expandedByControlId, defaultExpandedControlIds],
    );

    /**
     * Toggle the expansion state of a control card.
     * Flips the stored expansion state for the given control, allowing users to open/close
     * cards to manage long control lists. The toggle persists independently of list reordering
     * or visibility changes.
     */
    const toggleGraphControlExpanded = React.useCallback(
        (componentIdx: number) => {
            setExpandedByControlId((previous) => {
                const next = new Map(previous);
                const currentValue =
                    next.get(componentIdx) ??
                    defaultExpandedControlIds.has(componentIdx);
                next.set(componentIdx, !currentValue);
                return next;
            });
        },
        [defaultExpandedControlIds],
    );

    function renderControl(control: GraphControlItem) {
        const controlType = assertKnownGraphControlType(control.controlType);
        const FamilyComponent = CONTROLS_FAMILY_BY_TYPE[controlType];
        // componentIdx is globally unique, so controlType + componentIdx uniquely
        // identifies this control across ordering changes. This ensures React keys
        // and DOM ids remain stable when controlOrder reorders controls.
        const instanceId = `${controlType}_${control.componentIdx}`;

        // Render exactly one control payload per family invocation so family
        // components can preserve their internal card/control markup behavior.
        const controlFamilyProps: GraphControlsFamilyProps = {
            ...props,
            id: `${id}_control_${instanceId}`,
            isGraphControlExpanded,
            toggleGraphControlExpanded,
            SVs: {
                ...SVs,
                graphicalDescendantsForControls: [control],
            },
        };

        return <FamilyComponent key={instanceId} {...controlFamilyProps} />;
    }

    return <div id={id}>{orderedControls.map(renderControl)}</div>;
});
