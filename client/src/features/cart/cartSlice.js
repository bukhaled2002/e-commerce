import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],

  totalQuantity: 0,
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      console.log(existingItem);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice += newItem.price * newItem.quantity;
      } else {
        state.items.push({
          id: newItem.id,
          title: newItem.title,
          price: newItem.price,
          description: newItem.description,
          totalPrice: newItem.price * newItem.quantity,
          quantity: newItem.quantity,
          images: newItem.images,
        });
      }
      state.totalQuantity += newItem.quantity;
      state.totalAmount += newItem.price * newItem.quantity;
    },
    removeItemFromCart: (state, action) => {
      const itemToRemove = action.payload;
      const itemExists = state.items.find(
        (item) => item.id === itemToRemove.id
      );
      if (itemExists.quantity > 1) {
        itemExists.totalPrice -= itemExists.price;
        itemExists.quantity -= 1;
      } else if (itemExists.quantity <= 1) {
        state.items = state.items.filter((item) => item.id !== itemToRemove.id);
      }
      state.totalAmount -= itemExists.price;
      state.totalAmount -= 1;
    },
    removeEntireItemFromCart: (state, action) => {
      let itemToRemove = state.items.find(
        (item) => item.id === action.payload.id
      );
      state.totalAmount -= itemToRemove.totalPrice;
      state.totalQuantity -= itemToRemove.quantity;
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeItemFromCart, removeEntireItemFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
