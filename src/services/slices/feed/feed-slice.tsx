import { TOrdersData } from '@utils-types';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';

interface FeedState {
  feedData: TOrdersData;
  isLoading: boolean;
  error: SerializedError | null;
}

const initialState: FeedState = {
  feedData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (): Promise<TOrdersData> => {
    const { orders, total, totalToday } = await getFeedsApi();
    return { orders, total, totalToday };
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeed: (state: FeedState) => state.feedData,
    getFeedOrders: (state: FeedState) => state.feedData.orders,
    selectFeedStatus: (state) => ({
      isLoading: state.isLoading,
      error: state.error
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.feedData = action.payload;
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export const { getFeed, getFeedOrders } = feedSlice.selectors;
