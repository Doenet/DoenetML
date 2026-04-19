import { useEffect, useRef } from "react";

/**
 * Shared mutable snapshot for slider interactions.
 *
 * Families can merge incoming core values by key and then update/read the
 * latest value during overlapping transient interactions without stale closures.
 */
export function useLatestValues<T>(valuesByKey: Record<string, T>) {
    const latestValuesRef = useRef<Record<string, T>>({});

    useEffect(() => {
        latestValuesRef.current = {
            ...latestValuesRef.current,
            ...valuesByKey,
        };

        const activeKeys = new Set(Object.keys(valuesByKey));
        for (const key of Object.keys(latestValuesRef.current)) {
            if (!activeKeys.has(key)) {
                delete latestValuesRef.current[key];
            }
        }
    }, [valuesByKey]);

    function getLatestValue(key: string, fallback: T): T {
        return latestValuesRef.current[key] ?? fallback;
    }

    function setLatestValue(key: string, value: T) {
        latestValuesRef.current = {
            ...latestValuesRef.current,
            [key]: value,
        };
    }

    return {
        getLatestValue,
        setLatestValue,
    };
}
