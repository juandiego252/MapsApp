import Geolocation from '@react-native-community/geolocation';
import { Location } from '../../infrastructure/interfaces/location';
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import { useAuthStore } from '../../presentation/store/users/useAuthLocation';

export const getCurrentLocation = async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(info => {
            resolve({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude
            })
        }, (error) => {
            console.log(`Can't get posistion ${error}`);
            reject(error);
        }, {
            enableHighAccuracy: true
        });

    });

};
export const watchCurrentLocation = (locationCallback: (location: Location) => void): number => {
    const watchId = Geolocation.watchPosition(info => {
        const location: Location = {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
        };

        // Llama al callback con la nueva ubicación
        locationCallback(location);

        // Verifica si el usuario está autenticado y actualiza Firebase
        const { isAuthenticated } = useAuthStore.getState();
        const user = auth().currentUser;

        if (isAuthenticated && user) {
            database().ref(`/locations/${user.uid}`).set(location)
                .catch(error => console.log(`Can't update location in Firebase: ${error}`));
        }
    }, (error) => {
        console.log(`Can't get watch position: ${error}`);
    }, {
        enableHighAccuracy: true,
    });

    return watchId;
};
export const clearWatchLocation = (watchId: number) => {
    Geolocation.clearWatch(watchId);
}

export const getAllActiveUserLocations = async (): Promise<{ [key: string]: Location }> => {
    try {
        const snapshot = await database().ref('/locations').once('value');
        const data = snapshot.val();
        return data || {};
    } catch (error) {
        console.log(`Error fetching active user locations ${error}`);
        return {};
    }
}