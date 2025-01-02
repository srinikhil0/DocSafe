import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '@/features/auth/authSlice';

// Create store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser', 'auth/register/fulfilled', 'auth/login/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.createdAt',
          'payload.lastLoginAt',
          'payload.updatedAt',
          'payload.user.metadata',
          'payload.user.createdAt',
          'payload.user.lastLoginAt',
          'payload.user.updatedAt'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'auth.user.metadata',
          'auth.user.createdAt',
          'auth.user.lastLoginAt',
          'auth.user.updatedAt'
        ],
      },
    }),
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 