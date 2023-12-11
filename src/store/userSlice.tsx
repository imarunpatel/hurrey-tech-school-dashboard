import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../models/user";

export interface IUserState {
  user: IUser | null;
}

const initialState: IUserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: { type: string; payload: IUser }) => {
      state.user = {...action.payload, imgUrl: state.user?.imgUrl ? state.user?.imgUrl : action.payload.imgUrl};
    },
    updateProfile: (state, action: { type: string; payload: string }) => {
      let data = { ...state.user!, imgUrl: action.payload };
      state.user = data;
    },
    clearUser: (state) => {
      state = initialState;
    }
  },
});

export const { updateUser, updateProfile, clearUser } = userSlice.actions;

export default userSlice.reducer;
