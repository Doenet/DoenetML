export * from "./slice";
import { _dastReducerActions } from "./slice";
import { dastThunks } from "./thunks";

export const dastActions = { ..._dastReducerActions, ...dastThunks };
