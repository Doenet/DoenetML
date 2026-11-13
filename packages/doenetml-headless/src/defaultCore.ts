/**
 * The core `@doenet/doenetml-headless` runs when the caller names none.
 *
 * This is the only file that knows which core that is. Everything else in the
 * package works through the `HeadlessCore` interface from `@doenet/utils`, so
 * running another core by default is a change to this file alone; a caller can
 * also pass any `HeadlessCoreFactory` as the `coreFactory` option.
 */
import { createJavascriptHeadlessCoreFactory } from "@doenet/doenetml-worker-javascript/headless";
import type { HeadlessCoreFactory } from "@doenet/utils";
import { readResolverWasm } from "./resolverWasm";

export const defaultCoreFactory: HeadlessCoreFactory =
    createJavascriptHeadlessCoreFactory({ wasm: readResolverWasm });
