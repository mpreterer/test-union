import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { usersReducer } from "./slices/users/slice";

const rootReducer: any = combineReducers({
  users: usersReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { rootReducer, store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
