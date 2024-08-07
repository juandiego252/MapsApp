import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { Location } from '../../../infrastructure/interfaces/location';
import { FAB } from '../ui/FAB';
import { useLocationStore } from '../../store/location/useLocationStore';

interface Props {
    showUsersLocation?: boolean;
    initialLocation: Location;
}

export const Map = ({ showUsersLocation = true, initialLocation }: Props) => {

    const mapRef = useRef<MapView>();
    const cameraLocation = useRef<Location>(initialLocation);
    const { getLocation, lastKnowLocation, watchLocation, clearWatchLocation, userlocationList } = useLocationStore();
    const [isFollowingUser, setIsFollowingUser] = useState(true);
    const [isShowingPolyline, setIsShowingPolyline] = useState(true);
    const [isMarkerUserLocation, setIsMarkerUserLocation] = useState(true);
    const moveCamaraToLocation = (location: Location) => {
        if (!mapRef.current) return;
        mapRef.current.animateCamera({
            center: location
        })
    }
    const moveToCurrentLocation = async () => {
        if (!lastKnowLocation) {
            moveCamaraToLocation(initialLocation);
        }
        const location = await getLocation();
        if (!location) return;
        moveCamaraToLocation(location);
    }

    useEffect(() => {
        watchLocation();

        return () => {
            clearWatchLocation();
        }
    }, []);

    useEffect(() => {
        if (lastKnowLocation && isFollowingUser) {
            moveCamaraToLocation(lastKnowLocation);
        }
    }, [lastKnowLocation, isFollowingUser]);


    return (
        <>
            <MapView
                ref={(map) => mapRef.current = map!}
                showsUserLocation={showUsersLocation}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{ flex: 1 }}
                onTouchStart={() => setIsFollowingUser(false)}
                region={{
                    latitude: cameraLocation.current.latitude,
                    longitude: cameraLocation.current.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}>
                {
                    isShowingPolyline && (
                        <Polyline
                            coordinates={userlocationList}
                            strokeColor='black'
                            strokeWidth={5}
                        />
                    )
                }
                {lastKnowLocation &&
                    typeof lastKnowLocation.latitude === 'number' &&
                    typeof lastKnowLocation.longitude === 'number' &&
                    isMarkerUserLocation && (
                        <Marker
                            coordinate={{
                                latitude: lastKnowLocation.latitude,
                                longitude: lastKnowLocation.longitude,
                            }}
                            title="Mi ubicación"
                            description="Estoy aquí"
                        />
                    )}
            </MapView>
            <FAB
                iconName={isMarkerUserLocation ? 'flag' : 'flag-outline'}
                onPress={() => setIsMarkerUserLocation(!isMarkerUserLocation)}
                style={{
                    bottom: 200,
                    right: 20
                }}
            />
            <FAB
                iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
                onPress={() => setIsShowingPolyline(!isShowingPolyline)}
                style={{
                    bottom: 140,
                    right: 20
                }}
            />
            <FAB
                iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
                onPress={() => setIsFollowingUser(!isFollowingUser)}
                style={{
                    bottom: 80,
                    right: 20
                }}
            />
            <FAB
                iconName='compass-outline'
                onPress={moveToCurrentLocation}
                style={{
                    bottom: 20,
                    right: 20
                }}
            />
        </>
    )
}

