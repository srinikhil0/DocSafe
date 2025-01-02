export interface CitizenRecord {
  id: string;
  ssn: string; // hashed
  stateId: string; // hashed
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addressHistory: AddressRecord[];
  documentHistory: GovernmentDocument[];
  verificationAttempts: VerificationAttempt[];
}

export interface AddressRecord {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  validFrom: string;
  validTo?: string;
}

export interface GovernmentDocument {
  type: 'SSN' | 'STATE_ID' | 'DRIVERS_LICENSE' | 'BIRTH_CERTIFICATE';
  documentNumber: string;
  issuedAt: string;
  expiresAt?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  issuingAuthority: string;
}

export interface VerificationAttempt {
  id: string;
  timestamp: string;
  type: 'SSN' | 'STATE_ID' | 'ADDRESS';
  status: 'SUCCESS' | 'FAILURE';
  ipAddress: string;
  failureReason?: string;
}

export interface VerificationRequest {
  ssn_last4: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  stateId?: string;
  address?: AddressRecord;
}

export interface VerificationResponse {
  isVerified: boolean;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  message?: string;
  matchedFields?: string[];
  documentStatus?: {
    ssn?: boolean;
    stateId?: boolean;
    address?: boolean;
  };
} 