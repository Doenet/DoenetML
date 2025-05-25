import { configureStore } from "@reduxjs/toolkit";
import { mainSlice } from "./mainSlice";
import { keyboardSlice } from "./keyboardSlice";
// ...

export const store = configureStore({
    reducer: {
        main: mainSlice.reducer,
        keyboard: keyboardSlice.reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
