import type { FoodCategory } from '../enum';

export interface UserInfo {
  id: number;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface PlaceInfo {
  id: number;
  placeId: string;
  placeName: string;
  placeDesc: string;
  category: FoodCategory;
  lat: number;
  lng: number;
  createdAt: string;
}
