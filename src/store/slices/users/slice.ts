import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { FirebaseAPI } from "../../../FirebaseAPI";
import { User } from "../../../types/User";
import { Status } from "../../../types/Status";

type InitialState = {
  users: User[] | [];
  status: Status;
  errorMessage: string | null;
};

const initialState: InitialState = {
  users: [],
  status: "idle",
  errorMessage: null,
};

const NAMESPACE = "users";

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>(`${NAMESPACE}/fetchUsers`, async (_, { rejectWithValue }) => {
  try {
    const { data } = await FirebaseAPI.fetchUsers();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("An unexpected error occurred");
  }
});

const slice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        state.users = payload;
        state.errorMessage = null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.errorMessage = null;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.status = "rejected";
        if (typeof payload === "string") state.errorMessage = payload;
      });
  },
});

const usersReducer = slice.reducer;

export { usersReducer };
