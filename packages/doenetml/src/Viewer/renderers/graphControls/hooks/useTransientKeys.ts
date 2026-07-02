import { useState } from "react";

/**
 * Shared transient-key state for slider drag lifecycle handling.
 */
export function useTransientKeys() {
    const [transientKeySet, setTransientKeySet] = useState<Set<string>>(
        () => new Set(),
    );

    function markTransient(key: string) {
        setTransientKeySet((previousTransientKeySet) => {
            if (previousTransientKeySet.has(key)) {
                return previousTransientKeySet;
            }

            const nextTransientKeySet = new Set(previousTransientKeySet);
            nextTransientKeySet.add(key);
            return nextTransientKeySet;
        });
    }

    function clearTransient(key: string) {
        setTransientKeySet((previousTransientKeySet) => {
            if (!previousTransientKeySet.has(key)) {
                return previousTransientKeySet;
            }

            const nextTransientKeySet = new Set(previousTransientKeySet);
            nextTransientKeySet.delete(key);
            return nextTransientKeySet;
        });
    }

    function isTransient(key: string) {
        return transientKeySet.has(key);
    }

    function pruneToActiveKeys(activeKeys: Set<string>) {
        setTransientKeySet((previousTransientKeySet) => {
            const nextTransientKeySet = new Set<string>();

            for (const key of previousTransientKeySet) {
                if (activeKeys.has(key)) {
                    nextTransientKeySet.add(key);
                }
            }

            if (nextTransientKeySet.size === previousTransientKeySet.size) {
                let changed = false;

                for (const key of nextTransientKeySet) {
                    if (!previousTransientKeySet.has(key)) {
                        changed = true;
                        break;
                    }
                }

                if (!changed) {
                    return previousTransientKeySet;
                }
            }

            return nextTransientKeySet;
        });
    }

    return {
        markTransient,
        clearTransient,
        isTransient,
        pruneToActiveKeys,
    };
}
