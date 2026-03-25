import { describe, expect, it } from "vitest";
import {
    isAccessibilityRecord,
    type DiagnosticRecord,
} from "../src/errors/diagnostics";

describe("diagnostic predicates", () => {
    it("accepts accessibility records only when level is 1 or 2", () => {
        const level1Diagnostic: DiagnosticRecord = {
            type: "accessibility",
            level: 1,
            message: "Level 1 accessibility issue",
        };
        const level2Diagnostic: DiagnosticRecord = {
            type: "accessibility",
            level: 2,
            message: "Level 2 accessibility issue",
        };
        const missingLevelDiagnostic: DiagnosticRecord = {
            type: "accessibility",
            message: "Missing accessibility level",
        };
        const invalidLevelDiagnostic = {
            type: "accessibility",
            level: 3,
            message: "Invalid accessibility level",
        } as unknown as DiagnosticRecord;
        const warningDiagnostic: DiagnosticRecord = {
            type: "warning",
            message: "Warning",
        };

        expect(isAccessibilityRecord(level1Diagnostic)).eq(true);
        expect(isAccessibilityRecord(level2Diagnostic)).eq(true);
        expect(isAccessibilityRecord(missingLevelDiagnostic)).eq(false);
        expect(isAccessibilityRecord(invalidLevelDiagnostic)).eq(false);
        expect(isAccessibilityRecord(warningDiagnostic)).eq(false);
    });
});
