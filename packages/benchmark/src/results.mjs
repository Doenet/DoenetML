// Raw results: one JSON file per run under results/raw/, holding an array
// of records. A run appends to the day's file, so a sweep that is
// interrupted keeps what it measured.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/** The records in a results file, or none if it does not exist. */
export function readRecords(file) {
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
}

/** Append one record to a results file, creating it if needed. */
export function appendRecord(file, record) {
    mkdirSync(dirname(file), { recursive: true });
    const records = readRecords(file);
    records.push(record);
    writeFileSync(file, JSON.stringify(records, null, 4) + "\n");
}

/** Today's date in local time, so an evening run does not land on tomorrow's file. */
export function localDate() {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 10);
}
