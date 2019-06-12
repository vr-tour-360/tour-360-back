import { ImageFile, Place, PlaceDto, PlaceDetailDto, Connection, ConnectionDto, MapType } from './';
import { Document } from "mongoose";

export interface TourDto {
    readonly id: string;
    name: string;
    mapType: MapType;
    hasImage: boolean;
    filename?: string;
    startPlaceId?: string;
    isPublic: boolean;
    places: PlaceDto[];
    description?: string;
    authorId?: string;
    authorFullName?: string;
}

export interface TourDetailDto {
    id: string;
    name: string;
    places: PlaceDetailDto[];
    connections: ConnectionDto[];
    mapType: MapType;
    hasMapImage: boolean;
    imageWidth: number;
    imageHeight: number;
    filename: string;
    startPlaceId: string;
    isPublic: boolean;
    cover: ImageFile;
    description?: string;
}

export interface Tour extends Document {
    name: string;
    startPlaceId: string;
    cover: ImageFile;
    mapImage: ImageFile;
    mapType: MapType;
    places: Place[];
    connections: Connection[];
    createdBy: any;
    isPublic: boolean;
    description?: string;

    toClient: (this: Tour) => TourDto;
    updateTour: (this: Tour, dto: TourDetailDto) => void;
    hasConnection: (this: Tour, strtPlaceId: string, endPlaceId: string) => boolean;
    deleteConnection: (this: Tour, place1Id: string, place2Id: string) => void;
    getConnectionById: (this: Tour, id: string) => Connection;
    getPlace: (this: Tour, id: string) => Place;
    updatePlace: (this: Tour, dto: PlaceDetailDto) => void;
    deletePlace: (this: Tour, placeId: string) => void;
    toDetailDto: (this: Tour) => TourDetailDto;
}
