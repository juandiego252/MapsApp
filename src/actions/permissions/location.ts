import { check, openSettings, PERMISSIONS, request, PermissionStatus as RNPermissionStatus } from "react-native-permissions"
import { PermissionStatus } from "../../infrastructure/interfaces/permissions"
import { Platform } from "react-native";

export const requestLocationPermission = async (): Promise<PermissionStatus> => {
    let status: RNPermissionStatus = 'unavailable';

    if (Platform.OS === 'android') {
        status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
        throw new Error('Platform is not supported')
    }

    if (status === 'blocked') {
        await openSettings();
        return await checkLocationPermission();
    }

    const permissionsMapper: Record<RNPermissionStatus, PermissionStatus> = {
        granted: 'granted',
        denied: 'denied',
        blocked: 'block',
        unavailable: 'unavailable',
        limited: 'limited'
    };

    return permissionsMapper[status] ?? 'unavailable';
}

export const checkLocationPermission = async (): Promise<PermissionStatus> => {
    let status: RNPermissionStatus = 'unavailable';
    if (Platform.OS === 'android') {
        status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
        throw new Error('Platform is not supported')
    }

    const permissionsMapper: Record<RNPermissionStatus, PermissionStatus> = {
        granted: 'granted',
        denied: 'denied',
        blocked: 'block',
        unavailable: 'unavailable',
        limited: 'limited'
    };

    return permissionsMapper[status] ?? 'unavailable';
}