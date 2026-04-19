import React, { useEffect, useMemo, useState } from "react";
import { useControlInputState } from "../hooks/useControlInputState";
import { useLatestValues } from "../hooks/useLatestValues";
import { useTransientKeys } from "../hooks/useTransientKeys";
import {
    GraphControlsMode,
    ScalarControlRole,
    makeInputErrorId,
    makeScalarDraftKey,
    makeScalarTransientKey,
} from "../model";
import ScalarControl from "./ScalarControl";

type ScalarControlCoordinatorProps = {
    id: string;
    controlId: string;
    componentIdx: number;
    scalarRole: ScalarControlRole;
    sectionHeading?: React.ReactNode;
    sectionHeadingHasDivider?: boolean;
    label: string;
    graphControlsMode: Exclude<GraphControlsMode, "none">;
    value: number;
    min: number;
    max: number;
    step: number;
    formatValue: (value: number) => string;
    parseValue: (rawValue: string) => number | null;
    controlFamily: string;
    sliderAriaLabel: string;
    inputAriaLabel: string;
    commitErrorContext: string;
    onUpdateScalar: (payload: {
        componentIdx: number;
        scalarRole: ScalarControlRole;
        value: number;
        transient: boolean;
        skippable: boolean;
    }) => Promise<void>;
};

/**
 * Orchestrates scalar graph control behavior (drafts, parsing, validation,
 * transient slider state, and commits) while delegating rendering to ScalarControl.
 */
export default function ScalarControlCoordinator({
    id,
    controlId,
    componentIdx,
    scalarRole,
    sectionHeading,
    sectionHeadingHasDivider = true,
    label,
    graphControlsMode,
    value,
    min,
    max,
    step,
    formatValue,
    parseValue,
    controlFamily,
    sliderAriaLabel,
    inputAriaLabel,
    commitErrorContext,
    onUpdateScalar,
}: ScalarControlCoordinatorProps) {
    const {
        draftByKey,
        errorByKey,
        setDraft,
        hasDraft,
        isCommitting,
        pruneToActiveKeys: pruneInputKeysToActive,
        commitParsedInput,
    } = useControlInputState();

    const {
        isTransient,
        markTransient,
        clearTransient,
        pruneToActiveKeys: pruneTransientKeysToActive,
    } = useTransientKeys();

    const [rendererSliderValue, setRendererSliderValue] = useState(value);

    const latestScalarValuesByKey = useMemo(() => ({ scalar: value }), [value]);

    const { getLatestValue, setLatestValue } = useLatestValues(
        latestScalarValuesByKey,
    );

    const draftKey = makeScalarDraftKey(componentIdx, scalarRole);
    const transientKey = makeScalarTransientKey(componentIdx, scalarRole);

    useEffect(() => {
        const activeInputKeys =
            graphControlsMode === "all" || graphControlsMode === "inputsonly"
                ? new Set([draftKey])
                : new Set<string>();
        pruneInputKeysToActive(activeInputKeys);
    }, [draftKey, graphControlsMode, pruneInputKeysToActive]);

    useEffect(() => {
        pruneTransientKeysToActive(new Set([transientKey]));

        const scalarIsTransient = isTransient(transientKey);

        setRendererSliderValue((previousValue) => {
            const nextValue = scalarIsTransient ? previousValue : value;
            return nextValue === previousValue ? previousValue : nextValue;
        });
    }, [isTransient, pruneTransientKeysToActive, transientKey, value]);

    async function updateScalarFromSlider({
        nextValue,
        transient,
    }: {
        nextValue: number;
        transient: boolean;
    }) {
        setLatestValue("scalar", nextValue);
        setRendererSliderValue(nextValue);

        if (transient) {
            markTransient(transientKey);
        }

        await onUpdateScalar({
            componentIdx,
            scalarRole,
            value: nextValue,
            transient,
            skippable: transient,
        });
    }

    function clearTransientScalar() {
        clearTransient(transientKey);
    }

    async function commitScalarInput(rawValue: string) {
        const currentValue = getLatestValue("scalar", value);

        await commitParsedInput({
            key: draftKey,
            rawValue,
            parse: parseValue,
            errorMessage: "Enter a valid number or numeric expression.",
            isUnchanged: (parsedValue) => parsedValue === currentValue,
            onParsed: async (parsedValue) => {
                setLatestValue("scalar", parsedValue);
                setRendererSliderValue(parsedValue);

                await onUpdateScalar({
                    componentIdx,
                    scalarRole,
                    value: parsedValue,
                    transient: false,
                    skippable: false,
                });
            },
        });
    }

    return (
        <ScalarControl
            sectionHeading={sectionHeading}
            sectionHeadingHasDivider={sectionHeadingHasDivider}
            label={label}
            graphControlsMode={graphControlsMode}
            input={{
                value: draftByKey[draftKey] ?? formatValue(rendererSliderValue),
                ariaLabel: inputAriaLabel,
                error: errorByKey[draftKey],
                errorId: makeInputErrorId(id, controlFamily, draftKey),
                onDraftChange: (draftValue) => {
                    setDraft(draftKey, draftValue);
                },
                onCommit: commitScalarInput,
                hasDraft: hasDraft(draftKey),
                isCommitting: isCommitting(draftKey),
                commitErrorContext,
            }}
            slider={{
                id: `${id}-${controlId}-slider`,
                ariaLabel: sliderAriaLabel,
                min,
                max,
                step,
                value: rendererSliderValue,
                displayValue: formatValue(rendererSliderValue),
                onSliderChange: (nextValue, transient) => {
                    updateScalarFromSlider({
                        nextValue,
                        transient,
                    }).catch((error) => {
                        console.error(
                            `[graph-controls] failed to update scalar slider for ${componentIdx}:${scalarRole}`,
                            error,
                        );
                    });
                },
                onSliderDragEnd: clearTransientScalar,
            }}
        />
    );
}
