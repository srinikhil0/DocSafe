import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RegistrationData } from '../../types/auth';
import verificationService, {
  VerificationResult,
} from '../../services/verification/verificationService';
import governmentService from '../../services/government/governmentService';

interface VerificationState {
  verificationId: string | null;
  status: VerificationResult['status'] | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: VerificationState = {
  verificationId: null,
  status: null,
  isLoading: false,
  error: null,
  message: null,
};

// Initialize mock data (development only)
export const initializeMockData = createAsyncThunk(
  'verification/initializeMockData',
  async (_, { rejectWithValue }) => {
    try {
      await governmentService.initializeMockData();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify identity
export const verifyIdentity = createAsyncThunk(
  'verification/verifyIdentity',
  async (
    { userId, data }: { userId: string; data: RegistrationData },
    { rejectWithValue }
  ) => {
    try {
      const result = await verificationService.verifyIdentity(userId, data);
      if (!result.success) {
        return rejectWithValue(result.message);
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Check verification status
export const checkVerificationStatus = createAsyncThunk(
  'verification/checkStatus',
  async (verificationId: string, { rejectWithValue }) => {
    try {
      const result = await verificationService.checkVerificationStatus(
        verificationId
      );
      if (!result.success) {
        return rejectWithValue(result.message);
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Re-verify identity
export const reVerifyIdentity = createAsyncThunk(
  'verification/reVerify',
  async (verificationId: string, { rejectWithValue }) => {
    try {
      const result = await verificationService.reVerifyIdentity(verificationId);
      if (!result.success) {
        return rejectWithValue(result.message);
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    clearVerification: (state) => {
      state.verificationId = null;
      state.status = null;
      state.error = null;
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize Mock Data
    builder
      .addCase(initializeMockData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeMockData.fulfilled, (state) => {
        state.isLoading = false;
        state.message = 'Mock data initialized successfully';
      })
      .addCase(initializeMockData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify Identity
    builder
      .addCase(verifyIdentity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyIdentity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationId = action.payload.verificationId!;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(verifyIdentity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check Verification Status
    builder
      .addCase(checkVerificationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkVerificationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(checkVerificationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Re-verify Identity
    builder
      .addCase(reVerifyIdentity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reVerifyIdentity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(reVerifyIdentity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearVerification, clearError } = verificationSlice.actions;
export default verificationSlice.reducer; 