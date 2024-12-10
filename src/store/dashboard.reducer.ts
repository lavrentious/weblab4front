import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DashboardState = {
  x: number | null;
  y: number | null;
  r: number | null;
};

const initialState: DashboardState = {
  x: null,
  y: null,
  r: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setX(state, action: PayloadAction<number | null>) {
      state.x = action.payload;
    },
    setY(state, action: PayloadAction<number | null>) {
      state.y = action.payload;
    },
    setR(state, action: PayloadAction<number | null>) {
      state.r = action.payload;
    },
  },
});

export const { setX, setY, setR } = dashboardSlice.actions;

export default dashboardSlice.reducer;
