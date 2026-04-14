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
    onDragEnd?: () => void;
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
    onDragEnd,
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
     * End a pointer drag without sending a new action to core.
     * Clears transient flag so the useEffect below syncs localValue back to
     * whatever the parent's value prop says (i.e. the core-constrained value).
     * Notifies the parent via onDragEnd so it can clear its own transient
     * bookkeeping without dispatching a duplicate movePoint action.
     */
    function endDrag(): void {
        draggingRef.current = false;
        setTransient(false);
        onDragEnd?.();
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
                    try {
                        e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {
                        // Pointer capture may fail in test environments (synthetic events)
                        // or if pointer has already been released. Gracefully degrade.
                    }
                    draggingRef.current = true;
                    setTransient(true);
                }}
                onPointerUp={(e) => {
                    endDrag();
                }}
                onPointerCancel={(e) => {
                    endDrag();
                }}
                onBlur={(e) => {
                    if (transient) {
                        endDrag();
                    } else {
                        draggingRef.current = false;
                    }
                }}
            />
        </div>
    );
}
