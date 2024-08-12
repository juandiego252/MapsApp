import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useAuthStore } from '../presentation/store/users/useAuthLocation';
import firestore from '@react-native-firebase/firestore'

export const signUp = async (email: string, password: string, role: string = 'user'): Promise<FirebaseAuthTypes.UserCredential> => {
    try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        await firestore().collection('usuarios').doc(userCredential.user.uid).set({
            email: email,
            role: role
        })
        return userCredential;
    } catch (error) {
        throw new Error(`Can't signUp ${error}`);
    }
};
export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);

        const userDoc = await firestore().collection('usuarios').doc(userCredential.user.uid).get();
        const userData = userDoc.data();

        useAuthStore.getState().setIsAuthenticated(true);
        useAuthStore.getState().setUserRole(userData?.role || 'user')

        return userCredential;
    } catch (error) {
        throw new Error(`Can't singIn ${error}`);
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await auth().signOut();
        useAuthStore.getState().setIsAuthenticated(false);
        useAuthStore.getState().setUserRole(null);
    } catch (error) {
        throw new Error(`Can't singOut ${error}`);
    }
};

export const isAdmin = async (uid: string): Promise<boolean> => {
    try {
        const userDoc = await firestore().collection('usuarios').doc(uid).get();
        const userData = userDoc.data();
        return userData?.role === 'administrador';
    } catch (error) {
        console.error(`Can't verify rol administrador ${error}`);
        return false;
    }
}