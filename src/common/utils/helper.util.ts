import geohash from 'ngeohash';
import haversine from 'haversine-distance';

/**
 * Hash coordinates into a geohash string
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @returns string representing geohash
 */
export const geohashCoordinates = (
  latitude: number,
  longitude: number,
): string => {
  return geohash.encode(latitude, longitude, 9) as string;
};

/**
 * Check if a restaurant is within a given distance from user
 * @param longitude User longitude
 * @param latitude User latitude
 * @param restaurantGeohash Restaurant geohash
 * @param distanceInMetres Maximum allowed distance in meters
 * @returns boolean
 */
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
