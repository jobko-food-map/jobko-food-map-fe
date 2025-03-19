import type { FoodCategory } from "./category";

export interface Place {
    placeName: string;
    lat: number;
    lng: number;
    placeId: string;
    placeDesc: string;
    category: FoodCategory;
}
