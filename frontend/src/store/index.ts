import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  userType: 'patient' | 'doctor';
  userName: string;
  email: string;
  token: string | null;
}

const initialUserState: UserState = {
  isAuthenticated: true, // Default logged in for smooth preview
  userType: 'patient',
  userName: 'Rajesh Kumar',
  email: 'rajesh@email.com',
  token: 'mock_jwt_token_2026'
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isAuthenticated: true };
    },
    switchUserType: (state, action: PayloadAction<'patient' | 'doctor'>) => {
      state.userType = action.payload;
      state.userName = action.payload === 'doctor' ? 'Dr. Priya Sharma' : 'Rajesh Kumar';
    },
    logout: (state: UserState) => {
      state.isAuthenticated = false;
      state.token = null;
    }
  }
});

export const { setUser, switchUserType, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

