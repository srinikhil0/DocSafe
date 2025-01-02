import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db as citizenDb } from '../firebase/config';
import governmentService from '../government/governmentService';
import { RegistrationData } from '../../types/auth';

export interface VerificationResult {
  success: boolean;
  status: 'verified' | 'not_found' | 'mismatch' | 'deceased' | 'fraudulent' | 'duplicate';
  message: string;
  verificationId?: string;
}

export const verificationService = {
  // Verify a user's identity during registration
  async verifyIdentity(
    userId: string,
    data: RegistrationData
  ): Promise<VerificationResult> {
    try {
      // First, check for duplicate accounts
      const hasDuplicate = await governmentService.checkDuplicateAccounts(
        data.stateId,
        data.ssn_last4
      );

      if (hasDuplicate) {
        return {
          success: false,
          status: 'duplicate',
          message: 'An account already exists with these credentials',
        };
      }

      // Verify against government database
      const verificationResult = await governmentService.verifyCitizen(
        data.stateId,
        data.ssn_last4,
        data.firstName,
        data.lastName,
        data.dateOfBirth
      );

      if (!verificationResult.isVerified) {
        return {
          success: false,
          status: verificationResult.status,
          message: verificationResult.message,
        };
      }

      // Record the verification in both citizen and government databases
      const verificationId = `VER-${Date.now()}-${userId}`;
      
      await setDoc(doc(citizenDb, 'verifications', verificationId), {
        userId,
        stateId: data.stateId,
        ssn_last4: data.ssn_last4,
        status: 'verified',
        verifiedAt: serverTimestamp(),
        lastChecked: serverTimestamp(),
      });

      await governmentService.recordVerifiedUser(
        userId,
        data.stateId,
        data.ssn_last4
      );

      return {
        success: true,
        status: 'verified',
        message: 'Identity verified successfully',
        verificationId,
      };
    } catch (error) {
      console.error('Identity verification error:', error);
      throw error;
    }
  },

  // Check verification status
  async checkVerificationStatus(
    verificationId: string
  ): Promise<VerificationResult> {
    try {
      const docRef = doc(citizenDb, 'verifications', verificationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          status: 'not_found',
          message: 'Verification record not found',
        };
      }

      const verification = docSnap.data();

      // Update last checked timestamp
      await setDoc(
        docRef,
        { lastChecked: serverTimestamp() },
        { merge: true }
      );

      return {
        success: verification.status === 'verified',
        status: verification.status,
        message: verification.status === 'verified'
          ? 'Identity verification is valid'
          : 'Identity verification is pending or invalid',
        verificationId,
      };
    } catch (error) {
      console.error('Check verification status error:', error);
      throw error;
    }
  },

  // Re-verify identity periodically
  async reVerifyIdentity(verificationId: string): Promise<VerificationResult> {
    try {
      const docRef = doc(citizenDb, 'verifications', verificationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          status: 'not_found',
          message: 'Verification record not found',
        };
      }

      const verification = docSnap.data();

      // Re-verify against government database
      const verificationResult = await governmentService.verifyCitizen(
        verification.stateId,
        verification.ssn_last4,
        verification.firstName,
        verification.lastName,
        verification.dateOfBirth
      );

      // Update verification status
      await setDoc(
        docRef,
        {
          status: verificationResult.status,
          lastChecked: serverTimestamp(),
          verifiedAt: verificationResult.isVerified
            ? serverTimestamp()
            : verification.verifiedAt,
        },
        { merge: true }
      );

      return {
        success: verificationResult.isVerified,
        status: verificationResult.status,
        message: verificationResult.message,
        verificationId,
      };
    } catch (error) {
      console.error('Re-verification error:', error);
      throw error;
    }
  },
};

export default verificationService; 