import { Tour } from './tour';
import { PlaceDto } from './place';

export interface ConnectionDto {
    id: string;
    startPlace: PlaceDto;
    endPlace: PlaceDto;
    startPlacePosition: string;
    endPlacePosition: string;
}

export interface ConnectionDetailDto {
    id: string;
    placeId: string;
    name: string;
    latitude: number;
    longitude: number;
    image360Name: string;
    position: number;
    coverName: string;
}

export interface Connection {
    id: string;
    startPlaceId: string;
    endPlaceId: string;
    startPlacePosition: number;
    endPlacePosition: number;

    toClient: (tour: Tour) => ConnectionDto;
    startAsDestination: (tour: Tour) => ConnectionDetailDto;
    endAsDestination: (tour: Tour) => ConnectionDetailDto;
    equals: (place1Id: string, place2Id: string) => boolean;
}
