import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMenu } from "../requests/api"; // Ensure correct path

// Fetch Menu Data
export const fetchMenuData = createAsyncThunk("menu/fetchMenuData", async (_, { rejectWithValue }) => {
    try {
        const menu = await fetchMenu();
        console.log("Fetched menu data in Redux:", menu);
        return menu.sort((a, b) => (a.type === "dip" ? 1 : b.type === "dip" ? -1 : 0));
    } catch (error) {
        console.error("Redux fetch error:", error);
        return rejectWithValue(error.message);
    }
});

const menuSlice = createSlice({
    name: "menu",
    initialState: { items: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMenuData.fulfilled, (state, action) => {
                console.log("Redux menu stored:", action.payload);
                state.items = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchMenuData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default menuSlice.reducer;
