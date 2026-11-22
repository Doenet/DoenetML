import { describe, expect, it } from "vitest";
import type { HeadlessCoreFactory } from "@doenet/utils";
import {
    check,
    createHeadlessCore,
    defaultCoreFactory,
    gradeState,
    HeadlessError,
} from "../src";
import { stateAfter } from "./helpers";

function countingFactory(
    dataFormatVersion = defaultCoreFactory.dataFormatVersion,
) {
    const factory = {
        dataFormatVersion,
        created: 0,
        create(options: Parameters<HeadlessCoreFactory["create"]>[0]) {
            factory.created++;
            return defaultCoreFactory.create(options);
        },
    };
    return factory;
}

describe("the coreFactory option", () => {
    it("is the core createHeadlessCore, gradeState and check run", async () => {
        const doenetML = `<answer name="ans">x</answer>`;
        const coreFactory = countingFactory();

        const core = await createHeadlessCore({ doenetML, coreFactory });
        await core.terminate();
        expect(coreFactory.created).toBe(1);

        const state = await stateAfter(doenetML, async () => {});
        await gradeState(doenetML, 1, state, { coreFactory });
        expect(coreFactory.created).toBe(2);

        await check(doenetML, { coreFactory });
        expect(coreFactory.created).toBe(3);
    });

    it("gives gradeState the data_format_version it checks a state against", async () => {
        const doenetML = `<answer name="ans">x</answer>`;
        const state = await stateAfter(doenetML, async () => {});
        const coreFactory = countingFactory("not-a-version");

        const error = await gradeState(doenetML, 1, state, {
            coreFactory,
        }).catch((e) => e);
        expect(error).toBeInstanceOf(HeadlessError);
        expect((error as HeadlessError).code).toBe("dataFormatVersion");
        expect(coreFactory.created).toBe(0);
    });
});
