import { configureStore } from "@reduxjs/toolkit";
import schoolReducer from "./schoolSlice";
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        school: schoolReducer,
        user: userSlice
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;