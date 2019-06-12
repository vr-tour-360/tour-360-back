import {
    BaseWidget,
    TextWidget,
    RunVideoWidget,
    HintWidget,
    ImageWidget,
    ConnectionDetailDto,
    Tour,
    ImageFile,
    MediaFile,
} from './../interfaces';
import { Document } from 'mongoose';

export interface PlaceDto {
    readonly id: string;
    name: string;
    latitude: number;
    longitude: number;
    hasImage360: boolean;
    image360Width: number;
    image360Height: number;
    image360Name: string;
    mapIcon?: ImageFile;
}

export interface PlaceDetailDto {
    readonly id: string;
    name: string;
    latitude: number;
    longitude: number;
    hasImage360: boolean;
    image360Width: number;
    image360Height: number;
    image360Name: string;
    soundName: string;
    connections: ConnectionDetailDto[];
    widgets: any[];
    description: string;
    mapIcon?: ImageFile;
    cover?: ImageFile;
}

export interface Place extends Document {
    id: string;
    name: string;
    longitude: number;
    latitude: number,
    sound?: MediaFile,
    image360?: ImageFile;
    mapIcon?: ImageFile;
    cover?: ImageFile;
    widgets?: BaseWidget[];
    description?: string;

    toClient: () => PlaceDto;
    toDetailDto: (tour: Tour) => PlaceDetailDto;
    getWidget: <T = BaseWidget>(widgetId: string) => T;
}
