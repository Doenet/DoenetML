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
                    const nextValue = Number(
                        (e.target as HTMLInputElement).value,
                    );
                    setLocalValue(nextValue);
                    onChange(nextValue, transient);
                }}
                onMouseDown={() => {
                    setTransient(true);
                }}
                onMouseUp={(e) => {
                    const nextValue = Number(
                        (e.target as HTMLInputElement).value,
                    );
                    setTransient(false);
                    setLocalValue(nextValue);
                    onChange(nextValue, false);
                }}
                onTouchStart={() => {
                    setTransient(true);
                }}
                onTouchEnd={(e) => {
                    const nextValue = Number(
                        (e.target as HTMLInputElement).value,
                    );
                    setTransient(false);
                    setLocalValue(nextValue);
                    onChange(nextValue, false);
                }}
            />
        </div>
    );
}
