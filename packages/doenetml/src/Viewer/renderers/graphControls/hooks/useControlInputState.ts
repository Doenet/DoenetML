import { useRef, useState } from "react";

function clearKeyFromRecord(
    previousRecord: Record<string, string>,
    key: string,
): Record<string, string> {
    if (!Object.prototype.hasOwnProperty.call(previousRecord, key)) {
        return previousRecord;
    }

    const nextRecord = { ...previousRecord };
    delete nextRecord[key];
    return nextRecord;
}

/**
 * Shared graph-controls input state and guarded commit behavior.
 *
 * This consolidates logic that was previously repeated across control families:
 * - draft + error map state
 * - clear error on draft change
 * - in-flight commit de-duplication
 * - optional unchanged-value short-circuit
 */
export function useControlInputState() {
    const [draftByKey, setDraftByKey] = useState<Record<string, string>>({});
    const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});
    const draftByKeyRef = useRef<Record<string, string>>({});
    const committingInputKeysRef = useRef<Set<string>>(new Set());

    function setDraft(key: string, value: string) {
        draftByKeyRef.current = {
            ...draftByKeyRef.current,
            [key]: value,
        };

        setDraftByKey((previousDraftByKey) => ({
            ...previousDraftByKey,
            [key]: value,
        }));

        setErrorByKey((previousErrorByKey) =>
            clearKeyFromRecord(previousErrorByKey, key),
        );
    }

    function setError(key: string, error: string | null) {
        setErrorByKey((previousErrorByKey) => {
            if (error) {
                if (previousErrorByKey[key] === error) {
                    return previousErrorByKey;
                }
                return { ...previousErrorByKey, [key]: error };
            }

            return clearKeyFromRecord(previousErrorByKey, key);
        });
    }

    function clearDraft(key: string) {
        draftByKeyRef.current = clearKeyFromRecord(draftByKeyRef.current, key);

        setDraftByKey((previousDraftByKey) =>
            clearKeyFromRecord(previousDraftByKey, key),
        );
    }

    function hasDraft(key: string) {
        return Object.prototype.hasOwnProperty.call(draftByKeyRef.current, key);
    }

    function isCommitting(key: string) {
        return committingInputKeysRef.current.has(key);
    }

    function pruneToActiveKeys(activeKeys: Set<string>) {
        setDraftByKey((previousDraftByKey) => {
            const nextDraftByKey: Record<string, string> = {};
            let changed = false;

            for (const key in previousDraftByKey) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        previousDraftByKey,
                        key,
                    )
                ) {
                    if (activeKeys.has(key)) {
                        nextDraftByKey[key] = previousDraftByKey[key];
                    } else {
                        changed = true;
                    }
                }
            }

            if (changed) {
                draftByKeyRef.current = nextDraftByKey;
                return nextDraftByKey;
            }

            draftByKeyRef.current = previousDraftByKey;
            return previousDraftByKey;
        });

        setErrorByKey((previousErrorByKey) => {
            const nextErrorByKey: Record<string, string> = {};
            let changed = false;

            for (const key in previousErrorByKey) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        previousErrorByKey,
                        key,
                    )
                ) {
                    if (activeKeys.has(key)) {
                        nextErrorByKey[key] = previousErrorByKey[key];
                    } else {
                        changed = true;
                    }
                }
            }

            return changed ? nextErrorByKey : previousErrorByKey;
        });
    }

    async function commitParsedInput<T>({
        key,
        rawValue,
        parse,
        errorMessage,
        onParsed,
        isUnchanged,
    }: {
        key: string;
        rawValue: string;
        parse: (rawValue: string) => T | null;
        errorMessage: string;
        onParsed: (value: T) => Promise<void>;
        isUnchanged?: (value: T) => boolean;
    }) {
        if (isCommitting(key)) {
            return;
        }

        committingInputKeysRef.current.add(key);

        try {
            const parsed = parse(rawValue);
            if (parsed === null) {
                setError(key, errorMessage);
                return;
            }

            if (isUnchanged?.(parsed)) {
                setError(key, null);
                clearDraft(key);
                return;
            }

            setError(key, null);
            clearDraft(key);
            await onParsed(parsed);
        } finally {
            committingInputKeysRef.current.delete(key);
        }
    }

    return {
        draftByKey,
        errorByKey,
        setDraft,
        setError,
        clearDraft,
        hasDraft,
        isCommitting,
        pruneToActiveKeys,
        commitParsedInput,
    };
}
