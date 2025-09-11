import geohash from 'ngeohash';

export const geohashCoordinates = (
  longitude: number,
  latitude: number,
): string => {
  return geohash.encode(longitude, latitude, 9) as string;
};
