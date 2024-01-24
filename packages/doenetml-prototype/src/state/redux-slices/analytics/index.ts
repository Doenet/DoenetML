export * from "./slice";
import { _analyticsReducerActions } from "./slice";
import { analyticsThunks } from "./thunks";

export const analyticsActions = {
    ..._analyticsReducerActions,
    ...analyticsThunks,
};
