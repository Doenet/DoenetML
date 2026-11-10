/**
 * The JavaScript core's implementation of the `HeadlessCore` interface from
 * `@doenet/utils`, for `@doenet/doenetml-headless`. A separate entry from the
 * worker's main one so that nothing here reaches the browser worker bundle.
 */
export {
    createJavascriptHeadlessCore,
    HEADLESS_DEFAULT_FLAGS,
    type JavascriptHeadlessCoreOptions,
    type ResolverWasmSource,
} from "./javascriptHeadlessCore";
