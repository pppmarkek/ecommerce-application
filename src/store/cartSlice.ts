import { createSlice } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  title: string;
  img: string;
  price: number;
  currencyCode: string;
  quantity: number;
  smallDescription: string;
  discountedPrice?: number;
}

const initialState: CartItem[] = [];
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload as CartItem;
      const existingItem = state.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const index = state.findIndex((i) => i.id === itemId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.length = 0;
    },
    addQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.find((i) => i.id === itemId);
      if (item) {
        item.quantity += 1;
      }
    },
    removeQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.find((i) => i.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        const index = state.findIndex((i) => i.id === itemId);
        if (index !== -1) {
          state.splice(index, 1);
        }
      } else {
        console.warn(`Item with id ${itemId} not found or quantity is already 1.`);
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, addQuantity, removeQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
