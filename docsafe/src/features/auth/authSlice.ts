import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, googleProvider } from '@/services/firebase/config';
import { signInWithPopup, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';
import type { RegistrationData, AuthState, FirebaseError, UserProfile } from '@/types/auth';
import { Timestamp } from 'firebase/firestore';
import { AppDispatch } from '@/store/store';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const createUserProfile = (firebaseUser: User, additionalData?: Partial<RegistrationData>): UserProfile => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    firstName: additionalData?.firstName || '',
    lastName: additionalData?.lastName || '',
    dateOfBirth: additionalData?.dateOfBirth || '',
    address: additionalData?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    verificationStatus: 'pending' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
};

// Initialize auth state listener
export const initializeAuthListener = (dispatch: AppDispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser(createUserProfile(user)));
    } else {
      dispatch(clearUser());
    }
  });
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegistrationData, { rejectWithValue }) => {
    try {
      const { email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile with additional registration data
      return createUserProfile(userCredential.user, data);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      return rejectWithValue(firebaseError.message || 'An unexpected error occurred');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return createUserProfile(result.user);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      return rejectWithValue(firebaseError.message || 'An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      return rejectWithValue(firebaseError.message || 'An unexpected error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, clearError } = authSlice.actions;
export default authSlice.reducer; 