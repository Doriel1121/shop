import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import categoriesSlice from './slices/categoriesSlice';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    categories: categoriesSlice,
  },
});