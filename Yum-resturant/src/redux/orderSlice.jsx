import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiKey } from "../requests/api";

const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// Skicka en beställning
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const apiKey = await getApiKey();
      const tenantID = localStorage.getItem("tennantId") || "Cote d'azure";

      // Skapa en lista med alla artikel-ID:n baserat på antal
      const itemIDs = orderData.items.flatMap(item => Array(item.quantity).fill(item.id));

      const response = await fetch(`${API_URL}/${tenantID}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-zocom": apiKey,
        },
        body: JSON.stringify({ items: itemIDs }),
      });

      if (!response.ok) {
        throw new Error("Order kunde inte läggas.");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: { orderNumber: null, eta: null, status: "idle", error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => { state.status = "loading"; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderNumber = action.payload.order.id;
        state.eta = action.payload.eta;
        state.status = "success";
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
