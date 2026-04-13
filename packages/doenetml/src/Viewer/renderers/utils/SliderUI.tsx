import React, { useEffect, useState } from "react";

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

    function currentTargetValue(target: EventTarget | null) {
        return Number((target as HTMLInputElement | null)?.value ?? localValue);
    }

    function commitFinal(value: number) {
        setTransient(false);
        setLocalValue(value);
        onChange(value, false);
    }

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
                    const nextValue = currentTargetValue(e.target);
                    setLocalValue(nextValue);
                    onChange(nextValue, transient);
                }}
                onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setTransient(true);
                }}
                onPointerUp={(e) => {
                    commitFinal(currentTargetValue(e.target));
                }}
                onPointerCancel={(e) => {
                    commitFinal(currentTargetValue(e.target));
                }}
                onBlur={(e) => {
                    if (transient) {
                        commitFinal(currentTargetValue(e.target));
                    }
                }}
            />
        </div>
    );
}
