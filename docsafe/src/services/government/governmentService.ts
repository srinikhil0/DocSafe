import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { govDb as governmentDb } from '../firebase/config';

interface CitizenRecord {
  stateId: string;
  ssn_last4: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isDeceased: boolean;
  isFraudulent: boolean;
  lastVerified: any; // Firestore Timestamp
}

export const governmentService = {
  // Initialize mock data for testing
  async initializeMockData(): Promise<void> {
    const mockCitizens: CitizenRecord[] = [
      {
        stateId: 'DL123456789',
        ssn_last4: '1234',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'USA',
        },
        isDeceased: false,
        isFraudulent: false,
        lastVerified: serverTimestamp(),
      },
      {
        stateId: 'DL987654321',
        ssn_last4: '4321',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1985-05-15',
        address: {
          street: '456 Oak Ave',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        isDeceased: false,
        isFraudulent: false,
        lastVerified: serverTimestamp(),
      },
      // Add a fraudulent record
      {
        stateId: 'DL111111111',
        ssn_last4: '9999',
        firstName: 'Fraud',
        lastName: 'Test',
        dateOfBirth: '1980-12-31',
        address: {
          street: '789 Fake St',
          city: 'Nowhere',
          state: 'IL',
          zipCode: '00000',
          country: 'USA',
        },
        isDeceased: false,
        isFraudulent: true,
        lastVerified: serverTimestamp(),
      },
      // Add a deceased person record
      {
        stateId: 'DL222222222',
        ssn_last4: '8888',
        firstName: 'Deceased',
        lastName: 'Person',
        dateOfBirth: '1950-06-15',
        address: {
          street: '321 Memory Ln',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'USA',
        },
        isDeceased: true,
        isFraudulent: false,
        lastVerified: serverTimestamp(),
      },
    ];

    const batch = mockCitizens.map(async (citizen) => {
      const docRef = doc(governmentDb, 'citizens', citizen.stateId);
      await setDoc(docRef, citizen);
    });

    await Promise.all(batch);
  },

  // Verify a citizen's identity
  async verifyCitizen(
    stateId: string,
    ssn_last4: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Promise<{
    isVerified: boolean;
    status: 'verified' | 'not_found' | 'mismatch' | 'deceased' | 'fraudulent';
    message: string;
  }> {
    try {
      const docRef = doc(governmentDb, 'citizens', stateId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          isVerified: false,
          status: 'not_found',
          message: 'No record found with the provided State ID',
        };
      }

      const record = docSnap.data() as CitizenRecord;

      // Check if the person is deceased
      if (record.isDeceased) {
        return {
          isVerified: false,
          status: 'deceased',
          message: 'This person is marked as deceased in our records',
        };
      }

      // Check if the ID is marked as fraudulent
      if (record.isFraudulent) {
        return {
          isVerified: false,
          status: 'fraudulent',
          message: 'This ID is marked as potentially fraudulent',
        };
      }

      // Verify all fields match
      const isMatch =
        record.ssn_last4 === ssn_last4 &&
        record.firstName.toLowerCase() === firstName.toLowerCase() &&
        record.lastName.toLowerCase() === lastName.toLowerCase() &&
        record.dateOfBirth === dateOfBirth;

      if (!isMatch) {
        return {
          isVerified: false,
          status: 'mismatch',
          message: 'The provided information does not match our records',
        };
      }

      // Update last verified timestamp
      await setDoc(
        docRef,
        { lastVerified: serverTimestamp() },
        { merge: true }
      );

      return {
        isVerified: true,
        status: 'verified',
        message: 'Identity verified successfully',
      };
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  // Check for duplicate accounts
  async checkDuplicateAccounts(
    stateId: string,
    ssn_last4: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(governmentDb, 'verifiedUsers'),
        where('stateId', '==', stateId),
        where('ssn_last4', '==', ssn_last4)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Duplicate check error:', error);
      throw error;
    }
  },

  // Record a verified user
  async recordVerifiedUser(
    userId: string,
    stateId: string,
    ssn_last4: string
  ): Promise<void> {
    try {
      await setDoc(doc(governmentDb, 'verifiedUsers', userId), {
        userId,
        stateId,
        ssn_last4,
        verifiedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Record verified user error:', error);
      throw error;
    }
  },
};

export default governmentService; 