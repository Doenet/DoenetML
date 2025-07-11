export * from "./slice";
import { _coreReducerActions } from "./slice";
import { coreThunks } from "./thunks";

export const coreActions = { ..._coreReducerActions, ...coreThunks };
