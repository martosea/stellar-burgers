import { getOrdersApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type OrdersState = {
  data: TOrder[] | [];
  ordersLoading: boolean;
  newOrderError: null | SerializedError;
  ordersError: null | SerializedError;
  orderModalData: TOrder | null;
  isNewOrderLoading: boolean;
};

const initialState: OrdersState = {
  data: [],
  ordersLoading: false,
  newOrderError: null,
  ordersError: null,
  orderModalData: null,
  isNewOrderLoading: false
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    if (response?.success) {
      return response.order;
    } else {
      throw new Error('Ошибка при создании заказа');
    }
  }
);

export const fetchOrders = createAsyncThunk('order/fetchOrders', getOrdersApi);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  selectors: {
    getOrderState: (state: OrdersState) => state,
    getOrders: (state) => state.data,
    getOrderModalData: (state: OrdersState) => state.orderModalData,
    getIsNewOrderLoading: (state: OrdersState) => state.isNewOrderLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isNewOrderLoading = true;
        state.newOrderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
        state.isNewOrderLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isNewOrderLoading = false;
        state.newOrderError = action.error;
      })

      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.data = action.payload;
        state.ordersLoading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.error;
      });
  }
});

export const {
  getOrderState,
  getOrders,
  getOrderModalData,
  getIsNewOrderLoading
} = ordersSlice.selectors;
export const { resetOrderModalData } = ordersSlice.actions;
