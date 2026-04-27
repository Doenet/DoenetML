import { describe, expect, it } from "vitest";
import { formatCoordinateForControls } from "./mathFormatParse";

describe("graph controls math format parse", () => {
    const baseDisplaySettings = {
        displayDigits: 10,
        displayDecimals: 10,
        displaySmallAsZero: 1e-14,
        padZeros: false,
        avoidScientificNotation: false,
    };

    it("formats with scientific notation by default", () => {
        const formatted = formatCoordinateForControls(
            7e-12,
            baseDisplaySettings,
        );

        expect(formatted).eq("7 * 10^(-12)");
    });

    it("formats without scientific notation when avoidScientificNotation is true", () => {
        const formatted = formatCoordinateForControls(7e-12, {
            ...baseDisplaySettings,
            avoidScientificNotation: true,
        });

        expect(formatted).eq("0.000000000007");
    });

    it("still honors padZeros with avoidScientificNotation", () => {
        const formatted = formatCoordinateForControls(7e-12, {
            ...baseDisplaySettings,
            padZeros: true,
            avoidScientificNotation: true,
        });

        expect(formatted).eq("0.000000000007000000000");
    });
});
