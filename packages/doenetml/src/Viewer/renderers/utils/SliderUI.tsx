import React, { useEffect, useRef, useState } from "react";

/**
 * Keys that the browser uses to step a range input via keyboard.
 * When any of these are pressed while the slider is focused, subsequent
 * input events are treated as transient (skippable) until the slider loses
 * focus, allowing the user to accumulate steps across a constraint boundary
 * without being snapped back on each individual key press.
 */
const RANGE_INPUT_KEYS = new Set([
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
]);

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
 * @property {(value: number, transient: boolean) => void} onChange - Called whenever the slider value
 *   changes during interaction. When transient=true (during pointer drag or keyboard navigation),
 *   the parent should use skippable actions. Both pointer-up and keyboard-blur clear the transient
 *   state without calling onChange again, allowing the parent's sync effect to re-sync to the
 *   latest core-constrained value without a duplicate action.
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
    const keyboardActiveRef = useRef(false);

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
        keyboardActiveRef.current = false;
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
                onKeyDown={(e) => {
                    // Mark keyboard navigation as transient so that each arrow-key
                    // step does not immediately snap back through constraints. The
                    // final non-transient commit fires on blur (tab/click-away).
                    if (RANGE_INPUT_KEYS.has(e.key)) {
                        keyboardActiveRef.current = true;
                        setTransient(true);
                    }
                }}
                onInput={(e) => {
                    const nextValue = extractInputValue(e.target);
                    setLocalValue(nextValue);
                    onChange(
                        nextValue,
                        draggingRef.current || keyboardActiveRef.current,
                    );
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
                    // For keyboard input, we've already sent transient movePoint actions
                    // for each key press. When focus leaves, just sync back to core's
                    // constrained value without sending another movePoint action.
                    // This is the same pattern we use for pointer-up (endDrag).
                    if (transient || keyboardActiveRef.current) {
                        keyboardActiveRef.current = false;
                        endDrag();
                    } else {
                        draggingRef.current = false;
                    }
                }}
            />
        </div>
    );
}
