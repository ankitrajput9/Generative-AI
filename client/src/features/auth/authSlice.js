import { createSlice } from '@reduxjs/toolkit';
import { clearStoredAuth, getStoredAuth, saveAuth } from '../../utils/localStorage';

const initialAuth = getStoredAuth();

const initialState = {
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthenticated: Boolean(initialAuth.token),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      saveAuth(user, token);
    },
    registerUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      saveAuth(user, token);
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = '';
      state.isAuthenticated = false;
      clearStoredAuth();
    },
  },
});

export const { loginUser, registerUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
