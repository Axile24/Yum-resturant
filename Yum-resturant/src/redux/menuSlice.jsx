import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMenu } from "../requests/api";

// Hämta menyn (både wonton och dip)
export const fetchMenuData = createAsyncThunk(
  "menu/fetchMenuData",
  async (_, { rejectWithValue }) => {
    try {
      const menu = await fetchMenu();
      return menu.sort((a, b) => (a.type === "dip" ? 1 : b.type === "dip" ? -1 : 0));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: { items: [], status: "idle", error: null, selectedType: "wonton" },
  reducers: {
    setMenuType: (state, action) => {
      state.selectedType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMenuData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setMenuType } = menuSlice.actions;
export default menuSlice.reducer;
