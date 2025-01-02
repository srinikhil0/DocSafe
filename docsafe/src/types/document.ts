export type DocumentType =
  | 'SSN'
  | 'STATE_ID'
  | 'DRIVERS_LICENSE'
  | 'BIRTH_CERTIFICATE'
  | 'PASSPORT'
  | 'MEDICARE'
  | 'MEDICAID'
  | 'OTHER';

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  name: string;
  isVerified: boolean;
  verifiedBy?: 'GOVERNMENT' | 'SYSTEM';
  metadata: DocumentMetadata;
  accessLog: AccessLog[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentMetadata {
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority: string;
  documentNumber?: string;
  documentHash: string;
  mimeType: string;
  size: number;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  action: 'VIEW' | 'SHARE' | 'REVOKE' | 'UPDATE';
  performedBy: string;
  ipAddress: string;
  userAgent: string;
}

export interface ShareRequest {
  id: string;
  documentId: string;
  businessId: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'REVOKED';
  duration: number; // in hours
  accessToken?: string;
  createdAt: string;
  expiresAt: string;
}

export interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  shareRequests: ShareRequest[];
} 