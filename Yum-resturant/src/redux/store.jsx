import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        cart: cartReducer,
        order: orderReducer,
    },
    devTools: true, // Enable Redux DevTools
});

export default store;
