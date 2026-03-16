import { describe, expect, it } from "vitest";
import {
    PREFIG_VERSION,
    PREFIG_WHEEL_FILENAME,
} from "../src/worker/compiler-metadata";

describe("compiler metadata", () => {
    it("derives wheel filename from centralized PREFIG_VERSION", () => {
        expect(PREFIG_WHEEL_FILENAME).toBe(
            `prefig-${PREFIG_VERSION}-py3-none-any.whl`,
        );
    });
});
