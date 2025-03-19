import type { PlaceInfo } from './schemas';

export interface V1PlaceIdGetParameters {
  id: number;
}

export type V1PlaceIdGetResponse = PlaceInfo;
