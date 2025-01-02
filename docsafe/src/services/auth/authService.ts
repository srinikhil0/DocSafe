import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth as citizenAuth, db as citizenDb } from '../firebase/config';
import { RegistrationData, UserProfile } from '../../types/auth';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Register a new user
  async register(data: RegistrationData): Promise<UserProfile> {
    try {
      // Create Firebase auth user
      const { user } = await createUserWithEmailAndPassword(
        citizenAuth,
        data.email,
        data.password
      );

      // Create user profile in Firestore
      const profile: UserProfile = {
        uid: user.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(citizenDb, 'users', user.uid), profile);

      // Create verification request
      await setDoc(doc(citizenDb, 'verificationRequests', user.uid), {
        userId: user.uid,
        stateId: data.stateId,
        ssn_last4: data.ssn_last4,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      return profile;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      const { user } = await signInWithEmailAndPassword(citizenAuth, email, password);
      return await this.getUserProfile(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Sign in with Google
  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const { user } = await signInWithPopup(citizenAuth, googleProvider);
      let profile = await this.getUserProfile(user);

      // If profile doesn't exist, create one
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email!,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          verificationStatus: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(doc(citizenDb, 'users', user.uid), profile);
      }

      return profile;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Get user profile from Firestore
  async getUserProfile(user: User): Promise<UserProfile> {
    try {
      const docRef = doc(citizenDb, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  // Sign out
  async logout(): Promise<void> {
    try {
      await signOut(citizenAuth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(citizenAuth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Verify recovery code
  async verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
    try {
      const docRef = doc(citizenDb, 'recoveryCodes', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { codes } = docSnap.data();
        return codes.includes(code);
      }
      return false;
    } catch (error) {
      console.error('Recovery code verification error:', error);
      throw error;
    }
  },

  // Generate recovery codes
  async generateRecoveryCodes(userId: string): Promise<string[]> {
    const generateCode = () => {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let code = '';
      for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    try {
      const codes = Array.from({ length: 10 }, () => generateCode());
      await setDoc(doc(citizenDb, 'recoveryCodes', userId), {
        codes,
        createdAt: serverTimestamp(),
      });
      return codes;
    } catch (error) {
      console.error('Recovery codes generation error:', error);
      throw error;
    }
  },
};

export default authService; 