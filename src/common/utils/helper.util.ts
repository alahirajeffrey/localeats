import geohash from 'ngeohash';
import haversine from 'haversine-distance';

export const geohashCoordinates = (
  longitude: number,
  latitude: number,
): string => {
  return geohash.encode(longitude, latitude, 9) as string;
};

export const isProximityMatch = (
  longitude: number,
  latitude: number,
  restaurantGeohash: string,
  distanceInMetres: number,
): boolean => {
  const [decodedLat, decodedLon] = geohash.decode(restaurantGeohash) as [
    number,
    number,
  ];

  const userLocation = { lat: latitude, lon: longitude };
  const restaurantLocation = { lat: decodedLat, lon: decodedLon };

  const dist = haversine(userLocation, restaurantLocation);

  return dist <= distanceInMetres;
};
