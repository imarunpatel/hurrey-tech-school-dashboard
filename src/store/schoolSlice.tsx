import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ISchool } from "../models/school";
import { API_STATUSES } from "../models/api-status";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase-config";

export interface ISchoolState {
  data: ISchool[] | null;
  status: API_STATUSES;
  error: string | null;
}

const initialState: ISchoolState = {
  data: null,
  error: null,
  status: API_STATUSES.LOADING,
};

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    addNewSchool(state, action: { payload: ISchool }) {
      state.data?.push(action.payload);
    },
    updateSchool(
      state,
      action: { payload: { data: Partial<ISchool>; id: string } }
    ) {
      const newState = state;
      const index: number = newState.data?.findIndex(
        (item) => item.$id == action.payload.id
      )!;
      if (index !== -1 && state.data) {
        const updatedData = [...state.data];
        updatedData[index] = {
          ...updatedData[index],
          ...action.payload.data,
        };
        state.data = updatedData;
      }
    },
    deleteSchool(state, action: { payload: string }) {
      const newState = state;
      if (newState.data) {
        const filteredSchool = newState.data.filter(
          (item) => item.$id !== action.payload
        );
        state.data = filteredSchool;
      }
    },
    clearSchool(state) {
      state = initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSchool.pending, (state) => {
        state.status = API_STATUSES.LOADING;
      })
      .addCase(
        fetchAllSchool.fulfilled,
        (state, action: { type: string; payload: any }) => {
          if (action.payload) {
            state.status = API_STATUSES.IDLE;
            state.data = action.payload;
          } else {
            state.status = API_STATUSES.ERROR;
            state.error = action.payload.error;
          }
        }
      )
      .addCase(fetchAllSchool.rejected, (state, action) => {
        state.status = API_STATUSES.ERROR;
      });
  },
});

export const fetchAllSchool = createAsyncThunk(
  "school",
  async () => {
    let tempSchool: ISchool[] = [];
    const querySnapShot = await getDocs(collection(firestore, "schools"));
    querySnapShot.forEach((doc) => {
      tempSchool.push({
        $id: doc.id,
        board: doc.data().board,
        class: doc.data().class,
        medium: doc.data().medium,
        name: doc.data().name,
        createdAt: doc.data().createdAt,
      });
    });
    return tempSchool;
  },
  {
    condition: (value, { getState, extra }) => {
      const state: any = getState();
      if (state.school.data == null) {
        return true;
      } else {
        return false;
      }
    },
  }
);
export const { addNewSchool, updateSchool, deleteSchool, clearSchool } = schoolSlice.actions;
export default schoolSlice.reducer;
