import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useAuthStore } from '../presentation/store/users/useAuthLocation';

export const signUp = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
    try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        return userCredential;
    } catch (error) {
        throw new Error(`Can't signUp ${error}`);
    }
};
export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        useAuthStore.getState().setIsAuthenticated(true);
        return userCredential;
    } catch (error) {
        throw new Error(`Can't singIn ${error}`);
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await auth().signOut();
        useAuthStore.getState().setIsAuthenticated(false);
    } catch (error) {
        throw new Error(`Can't singOut ${error}`);
    }
};