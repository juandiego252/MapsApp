import React, { PropsWithChildren, useEffect } from 'react';
import { AppState } from 'react-native';
import { usePermissionStore } from '../store/permissions/usePermissionStore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../navigation/StackNavigator';
import { useAuthStore } from '../store/users/useAuthLocation';

export const PermissionsChecker = ({ children }: PropsWithChildren) => {
    const { isAuthenticated } = useAuthStore();
    const { locationStatus, checkLocationPermission } = usePermissionStore();
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    useEffect(() => {
        const navigate = () => {
            if (isAuthenticated) {
                if (locationStatus === 'granted') {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MapsScreen' }],
                    });
                } else if (locationStatus !== 'undetermined') {
                    navigation.reset({index: 0,routes: [{ name: 'PermissionScreen' }],});
                }
            } else {navigation.navigate('LoginScreen')}
        };

        navigate();
    }, [isAuthenticated, locationStatus, navigation]);

    useEffect(() => {
        if (isAuthenticated) {
            checkLocationPermission();
        }
    }, [isAuthenticated, checkLocationPermission]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active' && isAuthenticated) {
                checkLocationPermission();
            }
            console.log('AppState', nextAppState);
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {subscription.remove();};
    }, [isAuthenticated, checkLocationPermission]);
    return <>{children}</>;
};
