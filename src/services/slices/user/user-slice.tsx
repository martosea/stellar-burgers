import { TUser } from '@utils-types';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '../../../utils/cookie';

type userState = {
  data: TUser;
  isUserChecked: boolean;
  isUserAuthorised: boolean;
  userRegisterLoading: boolean;
  userRegisterError: SerializedError | null;
  userLoginLoading: boolean;
  userLoginError: SerializedError | null;
  userTokenLoading: boolean;
  userTokenError: SerializedError | null;
};

const initialState: userState = {
  data: {
    name: '',
    email: ''
  },
  isUserAuthorised: false,
  isUserChecked: false,
  userRegisterLoading: false,
  userRegisterError: null,
  userLoginError: null,
  userLoginLoading: false,
  userTokenLoading: false,
  userTokenError: null
};

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (data: Partial<TRegisterData>, { dispatch }) => {
    const response = await updateUserApi(data);
    if (!response.success) {
      throw new Error('Failed to update user data');
    }
    dispatch(userSlice.actions.userUpdate(response.user));
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    const response = await logoutApi();
    if (!response.success) {
      throw new Error('Failed to logout user');
    }
    localStorage.clear();
    deleteCookie('accessToken');
    dispatch(userSlice.actions.userLogout());
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData: TLoginData) => {
    const response = await loginUserApi(userData);
    if (!response.success) {
      throw new Error('Failed to login user');
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: TRegisterData) => {
    const response = await registerUserApi(userData);
    if (!response.success) {
      throw new Error('Failed to register user');
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  if (!response.success) {
    throw new Error('Failed to fetch user data');
  }
  return response.user;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.data = {
        name: '',
        email: ''
      };
      state.isUserAuthorised = false;
    },
    userUpdate: (state, action: PayloadAction<TUser>) => {
      state.data = action.payload;
      state.isUserAuthorised = true;
    }
  },
  selectors: {
    getUserState: (state: userState) => state,
    getUser: (state: userState) => state.data
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.userTokenLoading = true;
        state.userTokenError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.data = action.payload;
        state.isUserChecked = true;
        state.isUserAuthorised = true;
        state.userTokenLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userTokenLoading = false;
        state.isUserChecked = true;
        state.userTokenError = action.error;
        state.isUserAuthorised = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.userRegisterLoading = true;
        state.userRegisterError = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.data = action.payload;
          state.userRegisterLoading = false;
          state.isUserAuthorised = true;
          state.userTokenError = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.userRegisterLoading = false;
        state.userRegisterError = action.error;
      })
      .addCase(loginUser.pending, (state) => {
        state.userLoginLoading = true;
        state.userLoginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.data = action.payload;
        state.userLoginLoading = false;
        state.isUserAuthorised = true;
        state.userLoginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userLoginLoading = false;
        state.userLoginError = action.error;
      });
  }
});

export const { getUserState, getUser } = userSlice.selectors;
