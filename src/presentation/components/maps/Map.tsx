import React, { useEffect, useRef, useState, useMemo } from 'react'
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
    const markerColors = useMemo(() => ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], []);
    const mapRef = useRef<MapView>(null);
    const cameraLocation = useRef<Location>(initialLocation);
    const { getLocation, lastKnowLocation, watchLocation, clearWatchLocation, userlocationList } = useLocationStore();
    const [isFollowingUser, setIsFollowingUser] = useState(true);
    const [isShowingPolyline, setIsShowingPolyline] = useState(true);
    const [isMarkerUserLocation, setIsMarkerUserLocation] = useState(true);
    const [activeUserLocations, setActiveUserLocations] = useState<{ [key: string]: Location }>({});
    const [polygonArea, setPolygonArea] = useState(0);

    const locationCoordinates = useMemo(() => Object.values(activeUserLocations), [activeUserLocations]);

    const moveCamaraToLocation = (location: Location) => {
        mapRef.current?.animateCamera({ center: location });
    }

    const moveToCurrentLocation = async () => {
        const location = await getLocation();
        if (location) {
            moveCamaraToLocation(location);
        } else {
            moveCamaraToLocation(initialLocation);
        }
    }

    useEffect(() => {
        const fetchActiveUserLocations = async () => {
            const locations = await getAllActiveUserLocations();
            setActiveUserLocations(locations);
        };

        fetchActiveUserLocations();
        const interval = setInterval(fetchActiveUserLocations, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        watchLocation();
        return () => clearWatchLocation();
    }, []);

    useEffect(() => {
        if (lastKnowLocation && isFollowingUser) {
            moveCamaraToLocation(lastKnowLocation);
        }
    }, [lastKnowLocation, isFollowingUser]);

    useEffect(() => {
        const area = calculatePolygonArea(locationCoordinates);
        setPolygonArea(area);
    }, [locationCoordinates]);

    const getMarkerColor = useMemo(() => (userId: string) => {
        const colorIndex = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % markerColors.length;
        return markerColors[colorIndex];
    }, [markerColors]);

    const renderUserMarker = useMemo(() => {
        if (lastKnowLocation && isMarkerUserLocation) {
            return (
                <Marker
                    coordinate={lastKnowLocation}
                    title="Mi ubicación"
                    description="Estoy aquí"
                />
            );
        }
        return null;
    }, [lastKnowLocation, isMarkerUserLocation]);

    const renderOtherMarkers = useMemo(() => {
        return Object.entries(activeUserLocations).map(([userId, location]) => (
            <Marker
                key={userId}
                coordinate={location}
                title={`Usuario ${userId}`}
                description="Ubicación del usuario"
                pinColor={getMarkerColor(userId)}
            />
        ));
    }, [activeUserLocations, getMarkerColor]);

    return (
        <>
            <MapView
                ref={mapRef}
                showsUserLocation={showUsersLocation}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                onTouchStart={() => setIsFollowingUser(false)}
                region={{
                    ...cameraLocation.current,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
                {locationCoordinates.length > 0 && (
                    <Polygon
                        coordinates={locationCoordinates}
                        fillColor="rgba(0, 200, 0, 0.5)"
                        strokeColor="rgba(0, 0, 0, 0.5)"
                        strokeWidth={5}
                    />
                )}
                {isShowingPolyline && (
                    <Polyline
                        coordinates={userlocationList}
                        strokeColor='black'
                        strokeWidth={5}
                    />
                )}
                {renderUserMarker}
                {renderOtherMarkers}
            </MapView>
            <View style={styles.areaContainer}>
                <Text style={styles.areaText}>
                    Área: {polygonArea.toFixed(6)} km²
                </Text>
            </View>
            {/* <FAB
                iconName={isMarkerUserLocation ? 'flag' : 'flag-outline'}
                onPress={() => setIsMarkerUserLocation(!isMarkerUserLocation)}
                style={styles.fabMarker}
            /> */}
            <FAB
                iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
                onPress={() => setIsShowingPolyline(!isShowingPolyline)}
                style={styles.fabPolyline}
            />
            <FAB
                iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
                onPress={() => setIsFollowingUser(!isFollowingUser)}
                style={styles.fabFollow}
            />
            <FAB
                iconName='compass-outline'
                onPress={moveToCurrentLocation}
                style={styles.fabCompass}
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
    fabMarker: {
        bottom: 200,
        right: 20
    },
    fabPolyline: {
        bottom: 140,
        right: 20
    },
    fabFollow: {
        bottom: 80,
        right: 20
    },
    fabCompass: {
        bottom: 20,
        right: 20
    }
});