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
};

//Listar ususarios
export const listUsers = async (): Promise<Array<{ uid: string; email: string; role: string; active: boolean }>> => {
    try {
        const usersSnapshot = await firestore().collection('usuarios').get();
        const usersList = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                email: data.email,
                role: data.role,
                active: data.active ?? true, // Default to true if 'active' is not present
            };
        });
        return usersList;
    } catch (error) {
        throw new Error(`Error fetching users: ${error}`);
    }
};

// Activar o desactivar usuario
export const toggleUserActivation = async (uid: string, isActive: boolean): Promise<void> => {
    try {
        await firestore().collection('usuarios').doc(uid).update({
            active: isActive
        });
    } catch (error) {
        throw new Error(`Can't toggle activation: ${error}`);
    }
};

// Eliminar usuario
export const deleteUser = async (uid: string): Promise<void> => {
    try {
        await firestore().collection('usuarios').doc(uid).delete();
        const user = auth().currentUser;
        if (user && user.uid === uid) {
            await user.delete();
        }
    } catch (error) {
        throw new Error(`Can't delete user: ${error}`);
    }
};