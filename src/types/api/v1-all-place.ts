import type { PlaceInfo } from './schemas';

export interface GetPlacesResponse {
    content: PlaceInfo[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
  }

export type V1AllPlaceGetResponse = GetPlacesResponse;
