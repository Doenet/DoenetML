import React, { useEffect, useRef, useState } from "react";

/**
 * Props for the SliderUI component
 * @typedef {Object} SliderUIProps
 * @property {string} id - HTML id for the range input
 * @property {string} label - Display label for the slider
 * @property {string} ariaLabel - Accessible label for screen readers
 * @property {number} min - Minimum value
 * @property {number} max - Maximum value
 * @property {number} step - Step size (granularity of changes)
 * @property {number} value - Current value from external state (core state)
 * @property {(value: number, transient: boolean) => void} onChange - Called during drag and on release.
 *   When transient=true (during drag), parent should use skippable actions. When transient=false
 *   (on pointer up/blur), parent should commit the final value to core state. Constrained points
 *   will snap back to valid values on final commit.
 */
type SliderUIProps = {
    id: string;
    label: string;
    ariaLabel: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number, transient: boolean) => void;
};

/**
 * SliderUI - A range input component with transient (during-drag) vs. final state tracking.
 *
 * Tracks two states: localValue (UI state during dragging) and transient flag (whether user is actively dragging).
 * During drag (transient=true), onChange fires with intermediate values. On pointer up/blur (transient=false),
 * the final value is committed. The parent can use this to distinguish between:
 * - Transient updates: send as skippable actions during drag
 * - Final updates: trigger constraints/snap-to-grid behavior on release
 *
 * The localValue is synced to the external value prop only when not actively dragging,
 * allowing the UI to show pending changes while respecting snap-back when constraints apply.
 */
export default function SliderUI({
    id,
    label,
    ariaLabel,
    min,
    max,
    step,
    value,
    onChange,
}: SliderUIProps) {
    const [localValue, setLocalValue] = useState(value);
    const [transient, setTransient] = useState(false);
    const draggingRef = useRef(false);

    /**
     * Extract numeric value from input element with fallback to localValue
     */
    function extractInputValue(target: EventTarget | null): number {
        return Number((target as HTMLInputElement | null)?.value ?? localValue);
    }

    /**
     * Commit slider value and exit transient state.
     * Called on pointer up, pointer cancel, or blur while dragging.
     */
    function commitFinal(value: number): void {
        draggingRef.current = false;
        setTransient(false);
        setLocalValue(value);
        onChange(value, false);
    }

    /**
     * Sync UI state with external value prop when not actively dragging.
     * This ensures that snap-back behavior from constraints is reflected in the UI.
     */
    useEffect(() => {
        if (!transient) {
            setLocalValue(value);
        }
    }, [value, transient]);

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue}
                aria-label={ariaLabel}
                style={{ width: "100%" }}
                onInput={(e) => {
                    const nextValue = extractInputValue(e.target);
                    setLocalValue(nextValue);
                    onChange(nextValue, draggingRef.current);
                }}
                onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    draggingRef.current = true;
                    setTransient(true);
                }}
                onPointerUp={(e) => {
                    commitFinal(extractInputValue(e.target));
                }}
                onPointerCancel={(e) => {
                    commitFinal(extractInputValue(e.target));
                }}
                onBlur={(e) => {
                    if (transient) {
                        commitFinal(extractInputValue(e.target));
                    } else {
                        draggingRef.current = false;
                    }
                }}
            />
        </div>
    );
}
