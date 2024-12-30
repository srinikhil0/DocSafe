import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Share {
    id: string;
    documentId: string;
    userId: string;
    businessId: string;
    sharedAt: string;
    expiryTime: number;
    status: 'active' | 'revoked' | 'expired';
}

interface SharingState {
    shares: Share[];
    activeShares: Share[];
    loading: boolean;
    error: string | null;
    currentSharingNumber: string | null;
}

const initialState: SharingState = {
    shares: [],
    activeShares: [],
    loading: false,
    error: null,
    currentSharingNumber: null,
};

const sharingSlice = createSlice({
    name: 'sharing',
    initialState,
    reducers: {
        setShares: (state, action: PayloadAction<Share[]>) => {
            state.shares = action.payload;
            state.activeShares = action.payload.filter(share => share.status === 'active');
            state.loading = false;
            state.error = null;
        },
        addShare: (state, action: PayloadAction<Share>) => {
            state.shares.push(action.payload);
            if (action.payload.status === 'active') {
                state.activeShares.push(action.payload);
            }
        },
        updateShare: (state, action: PayloadAction<Share>) => {
            const index = state.shares.findIndex(share => share.id === action.payload.id);
            if (index !== -1) {
                state.shares[index] = action.payload;
                state.activeShares = state.shares.filter(share => share.status === 'active');
            }
        },
        revokeShare: (state, action: PayloadAction<string>) => {
            const share = state.shares.find(share => share.id === action.payload);
            if (share) {
                share.status = 'revoked';
                state.activeShares = state.shares.filter(share => share.status === 'active');
            }
        },
        setCurrentSharingNumber: (state, action: PayloadAction<string | null>) => {
            state.currentSharingNumber = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setShares,
    addShare,
    updateShare,
    revokeShare,
    setCurrentSharingNumber,
    setLoading,
    setError,
    clearError,
} = sharingSlice.actions;

export default sharingSlice.reducer; 