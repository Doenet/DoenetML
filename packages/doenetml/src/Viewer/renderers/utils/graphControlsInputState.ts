import type React from "react";

type StateSetter = React.Dispatch<React.SetStateAction<Record<string, string>>>;

type ParseFunction<T> = (rawValue: string) => T | null;

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

export function setDraftAndClearError({
    key,
    value,
    setDraftByKey,
    setErrorByKey,
}: {
    key: string;
    value: string;
    setDraftByKey: StateSetter;
    setErrorByKey: StateSetter;
}) {
    setDraftByKey((previousDraftByKey) => ({
        ...previousDraftByKey,
        [key]: value,
    }));

    setErrorByKey((previousErrorByKey) =>
        clearKeyFromRecord(previousErrorByKey, key),
    );
}

export async function commitParsedInput<T>({
    key,
    rawValue,
    parse,
    errorMessage,
    setDraftByKey,
    setErrorByKey,
    onParsed,
}: {
    key: string;
    rawValue: string;
    parse: ParseFunction<T>;
    errorMessage: string;
    setDraftByKey: StateSetter;
    setErrorByKey: StateSetter;
    onParsed: (value: T) => Promise<void>;
}) {
    const parsed = parse(rawValue);

    if (parsed === null) {
        setErrorByKey((previousErrorByKey) => ({
            ...previousErrorByKey,
            [key]: errorMessage,
        }));
        return;
    }

    setErrorByKey((previousErrorByKey) =>
        clearKeyFromRecord(previousErrorByKey, key),
    );
    setDraftByKey((previousDraftByKey) =>
        clearKeyFromRecord(previousDraftByKey, key),
    );

    await onParsed(parsed);
}
