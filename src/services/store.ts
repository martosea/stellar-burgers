import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { userSlice } from './slices/user/user-slice';
import { ingredientSlice } from './slices/ingridients/ingridients-slice';
import { burgerConstructorSlice } from './slices/constructor/constructor-slice';
import { feedSlice } from './slices/feed/feed-slice';
import { orderSlice } from './slices/order/order-slice';
import { ordersSlice } from './slices/orders/orders-slice';

const rootReducer = combineSlices(
  ingredientSlice,
  burgerConstructorSlice,
  feedSlice,
  userSlice,
  orderSlice,
  ordersSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;
