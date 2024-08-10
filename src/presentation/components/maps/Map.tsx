import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Polygon } from 'react-native-maps';
import { Location } from '../../../infrastructure/interfaces/location';
import { FAB } from '../ui/FAB';
import { useLocationStore } from '../../store/location/useLocationStore';
import { getAllActiveUserLocations } from '../../../actions/location/location';
import { calculatePolygonArea } from '../../../actions/area/polygonArea';

interface Props {
    showUsersLocation?: boolean;
    initialLocation: Location;
}

export const Map = ({ showUsersLocation = true, initialLocation }: Props) => {

    const markerColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const mapRef = useRef<MapView>();
    const cameraLocation = useRef<Location>(initialLocation);
    const { getLocation, lastKnowLocation, watchLocation, clearWatchLocation, userlocationList } = useLocationStore();
    const [isFollowingUser, setIsFollowingUser] = useState(true);
    const [isShowingPolyline, setIsShowingPolyline] = useState(true);
    const [isMarkerUserLocation, setIsMarkerUserLocation] = useState(true);
    const [activeUserLocations, setActiveUserLocations] = useState<{ [key: string]: Location }>({});
    const [polygonArea, setPolygonArea] = useState(0);
    const locationCoordinates = Object.values(activeUserLocations);
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
        const fechActiveUserLocations = async () => {
            const locations = await getAllActiveUserLocations();
            setActiveUserLocations(locations);
        };
        fechActiveUserLocations();
        // Rellena el interval para actualizar ubicaciones cada cierto tiempo
        const interval = setInterval(fechActiveUserLocations, 5000); // Actualizar cada 5 segundos

        return () => {
            clearInterval(interval);
        };

    }, [])

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
    useEffect(() => {
        const area = calculatePolygonArea(locationCoordinates);
        setPolygonArea(area);
    }, [activeUserLocations]);

    const getMarkerColor = (userId: string) => {
        const colorIndex = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % markerColors.length;
        return markerColors[colorIndex];
    }

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
                {/* Polígono que une los marcadores */}
                {locationCoordinates.length > 0 && (
                    <Polygon
                        coordinates={locationCoordinates}
                        fillColor="rgba(0, 200, 0, 0.5)"
                        strokeColor="rgba(0, 0, 0, 0.5)"
                        strokeWidth={5}
                    />
                )}
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
                {Object.entries(activeUserLocations).map(([userId, location]) => (
                    <Marker
                        key={userId}
                        coordinate={location}
                        title={`Usuario ${userId}`}
                        description="Ubicación del usuario"
                        pinColor={getMarkerColor(userId)}
                    />
                ))}
            </MapView>
            <View style={styles.areaContainer}>
                <Text style={styles.areaText}>
                    Área: {polygonArea.toFixed(6)} km²
                </Text>
            </View>
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

const styles = StyleSheet.create({
    areaContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    areaText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});