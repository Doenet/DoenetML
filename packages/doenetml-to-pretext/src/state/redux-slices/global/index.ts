export * from "./slice";
import { _globalReducerActions } from "./slice";
import { globalThunks } from "./thunks";

export const globalActions = { ..._globalReducerActions, ...globalThunks };
