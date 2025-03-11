import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiKey } from "../requests/api";

const API_BASE_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";

// Async thunk för att lägga en order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const apiKey = await getApiKey();
      const tenantId = localStorage.getItem("tenantId") || "SimonFoodTruck";
      
      const itemIds = orderData.items.flatMap(item =>
        Array(item.quantity).fill(item.id)
      );

      const response = await fetch(`${API_BASE_URL}/${tenantId}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-zocom": apiKey,
        },
        body: JSON.stringify({ items: itemIds }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Status code:", response.status);
        console.log("Error text from server:", errorText);
        throw new Error("Order kunde inte läggas");
      }

      const data = await response.json();
      console.log("API response:", data); // För felsökning
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderNumber: null,
    eta: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderNumber = action.payload.order.id; 
        state.eta = action.payload.order.eta;        
        state.status = "succeeded";
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;