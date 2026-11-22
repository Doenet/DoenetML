import type {
    HeadlessCore,
    HeadlessCoreFactory,
    HeadlessCoreOptions,
} from "@doenet/utils";
import { defaultCoreFactory } from "./defaultCore";

export type CreateHeadlessCoreOptions = HeadlessCoreOptions & {
    /** The core to run. Defaults to the JavaScript core. */
    coreFactory?: HeadlessCoreFactory;
};

/**
 * Create a core running `doenetML` without a browser.
 *
 * A `savedState` is applied as it is, without the checks `gradeState` makes;
 * use `gradeState` to grade one. Call `terminate()` on the core when done.
 */
export function createHeadlessCore({
    coreFactory = defaultCoreFactory,
    ...options
}: CreateHeadlessCoreOptions): Promise<HeadlessCore> {
    return coreFactory.create(options);
}
