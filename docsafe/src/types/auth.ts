import { Timestamp } from 'firebase/firestore';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  ssn_last4: string;
  stateId: string;
  address: Address;
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface FirebaseError {
  code: string;
  message: string;
  name: string;
} 