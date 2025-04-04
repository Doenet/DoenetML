import { vi } from "vitest";

/** Mock the call to hyperformula that occurs inside the evaluatedCells of spreadsheet.
 *  The evaluatedCells variable will always be empty, but at least tests can run.*/
export const HyperFormula = {
    buildFromArray: vi.fn(() => ({ getSheetValues: vi.fn() })),
};
