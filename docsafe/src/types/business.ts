export interface Business {
  id: string;
  name: string;
  registrationNumber: string;
  emailDomain: string;
  address: BusinessAddress;
  industry: IndustryType;
  verificationStatus: BusinessVerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type IndustryType =
  | 'FINANCIAL'
  | 'HEALTHCARE'
  | 'GOVERNMENT'
  | 'EDUCATION'
  | 'LEGAL'
  | 'OTHER';

export interface BusinessVerificationStatus {
  isVerified: boolean;
  verifiedAt?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  lastVerificationCheck: string;
}

export interface BusinessState {
  profile: Business | null;
  documentRequests: DocumentRequest[];
  isLoading: boolean;
  error: string | null;
}

export interface DocumentRequest {
  id: string;
  businessId: string;
  userId: string;
  documentTypes: string[];
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  requestedAt: string;
  validUntil: string;
} 