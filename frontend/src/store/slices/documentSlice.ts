import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Document {
    id: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadDate: string;
    status: 'active' | 'deleted';
    userId: string;
}

interface DocumentState {
    documents: Document[];
    selectedDocument: Document | null;
    loading: boolean;
    error: string | null;
}

const initialState: DocumentState = {
    documents: [],
    selectedDocument: null,
    loading: false,
    error: null,
};

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setDocuments: (state, action: PayloadAction<Document[]>) => {
            state.documents = action.payload;
            state.loading = false;
            state.error = null;
        },
        addDocument: (state, action: PayloadAction<Document>) => {
            state.documents.push(action.payload);
        },
        updateDocument: (state, action: PayloadAction<Document>) => {
            const index = state.documents.findIndex(doc => doc.id === action.payload.id);
            if (index !== -1) {
                state.documents[index] = action.payload;
            }
        },
        deleteDocument: (state, action: PayloadAction<string>) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload);
        },
        setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
            state.selectedDocument = action.payload;
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
    setDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    setSelectedDocument,
    setLoading,
    setError,
    clearError,
} = documentSlice.actions;

export default documentSlice.reducer; 