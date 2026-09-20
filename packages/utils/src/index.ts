export * from "./ast/logging";
export * from "./diagnostics/types";
export * from "./diagnostics/coded";
export * from "./keyboard/keyboardShortcuts";
export * from "./keyboard/pointerType";
export * from "./media/cid";
export * from "./media/retrieveTextFile";
export * from "./copy/deepFunctions";
export * from "./copy/parseStringify";
export * from "./components/domain";
export * from "./components/compositeLists";
export * from "./components/enumeration";
export * from "./components/function";
export * from "./components/mathInputFunctionNames";
export * from "./components/mediaLicense";
export * from "./components/sequence";
export * from "./components/size";
export * from "./math/array";
export * from "./math/math";
export * from "./math/mathjax-loader";
export * from "./math/mathexpressions";
export * from "./math/rounding";
export * from "./math/subset-of-reals-operations";
export * from "./style/colorWords";
export * from "./style/fillPattern";
export * from "./style/palettes";
export * from "./style/paletteInfo";
export * from "./style/readerOverrides";
export * from "./style/style";
export * from "./style/styleDescriptions";
export * from "./style/styleDescriptionDefinitions";
export * from "./style/styleDefinitionHelpers";
export * from "./theme/theme";
export * from "./types/core";
export * from "./url/url";
export * from "./version/doenetMLversion";

import * as subsets from "./math/subset-of-reals";
export { subsets };

/**
 * The shape of the saved reader state this version writes and will read back.
 *
 * Bumped whenever that shape changes in a way that makes older state
 * unreadable, which discards it rather than misapplying it. 0.8.0 re-keyed
 * saved state from component build indices to identifiers derived from the
 * document (Doenet/DoenetML#1944), so 0.7 state does not denote the same
 * components any more.
 *
 * It travels inside the state payload itself, which hosts are told to store
 * opaquely and hand back unread — a sibling field on the message would not
 * survive that round trip.
 */
export const data_format_version = "0.8.0";
