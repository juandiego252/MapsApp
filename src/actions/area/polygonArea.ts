
interface Coordinate {latitude: number;longitude: number;}
export const calculatePolygonArea = (coordinates: Coordinate[]): number => {
    let area = 0;
    if (coordinates.length > 2) {
        for (let i = 0; i < coordinates.length; i++) {
            let j = (i + 1) % coordinates.length;
            area += coordinates[i].latitude * coordinates[j].longitude;
            area -= coordinates[j].latitude * coordinates[i].longitude;
        }
        area = Math.abs(area)/ 2;
        // Convertir a kilómetros cuadrados (solo una aproximación)
        area *= 111.32 * 111.32;
    }
    return area;
};