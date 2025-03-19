import type { PlaceInfo } from './schemas';

export type V1PlacePostRequest = Pick<PlaceInfo, 'placeName' | 'placeId' | 'placeDesc' | 'category' | 'lat' | 'lng'>;
export type V1PlacePostResponse = PlaceInfo;
