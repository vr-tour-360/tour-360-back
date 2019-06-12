import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;
import PlaceSchema from './place';
import Connection from './connection';
import { Tour, TourDetailDto, TourDto } from './interfaces/tour';
import { PlaceDetailDto } from "./interfaces";

const TourSchema = new mongoose.Schema<Tour>({
    name: { type: String, required: true },
    startPlaceId: { type: String },
    cover: {
        filename: String,
        contentType: String,
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    mapImage: {
        filename: String,
        contentType: String,
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    mapType: { type: Number, required: true },
    places: [PlaceSchema],
    connections: [Connection],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false, required: true },
    description: { type: String, default: '' },
});

TourSchema.index({ createdBy: 1, name: 1 }, { unique: true });

TourSchema.methods.toClient = function () {
    let startPlaceId = this.startPlaceId;

    if (!startPlaceId && (this.places || []).length !== 0) {
        startPlaceId = this.places[0].id;
    }

    return {
        id: this.id,
        name: this.name,
        mapType: this.mapType,
        hasImage: this.cover && this.cover.filename != null,
        filename: this.cover && this.cover.filename,
        startPlaceId,
        isPublic: this.isPublic,
        places: (this.places || []).map(place => place.toClient()),
        description: this.description,
        authorId: this.createdBy.id,
        authorFullName: this.createdBy.fullname,
    };
};

TourSchema.methods.toDetailDto = function () {
    const dto: TourDetailDto = {
        id: this.id,
        name: this.name,
        places: (this.places || []).map(place => place.toDetailDto(this)),
        connections: (this.connections || []).map(connection => connection.toClient(this)),
        mapType: this.mapType,

        hasMapImage: this.mapImage && this.mapImage.filename != null,
        imageWidth: this.mapImage && this.mapImage.width,
        imageHeight: this.mapImage && this.mapImage.height,
        filename: this.mapImage && this.mapImage.filename,

        cover: this.cover,

        startPlaceId: this.startPlaceId,
        isPublic: this.isPublic,
        description: this.description,
    };

    return dto;
};

TourSchema.methods.hasConnection = function (startPlaceId: string, endPlaceId: string) {
    const connection = (this.connections || []).some(c => c.equals(startPlaceId, endPlaceId));

    return connection;
};

TourSchema.methods.deleteConnection = function (place1Id: string, place2Id: string) {
    this.connections = (this.connections || []).filter(c => !c.equals(place1Id, place2Id));
};

TourSchema.methods.getConnectionById = function (id: string) {
    return this.connections.find(c => c.id === id);
};

TourSchema.methods.getPlace = function (id: string) {
    const index = this.places.findIndex((value) => value.id === id);
    const place = this.places[index];

    return place;
};

TourSchema.methods.updateTour = function(dto: TourDetailDto) {
    this.startPlaceId = dto.startPlaceId;
    this.name = dto.name;
    this.isPublic = dto.isPublic;
    this.description = dto.description;
    
    (dto.places || []).forEach((place) => {
        this.updatePlace(place);
    });

    //TODO: add updating connections
};

TourSchema.methods.updatePlace = function(dto: PlaceDetailDto) {
    const place = this.getPlace(dto.id);
    place.name = dto.name;
    place.longitude = dto.longitude;
    place.latitude = dto.latitude;
    place.description = dto.description;
    place.widgets = dto.widgets;
    place.markModified('widgets');
    place.mapIcon = dto.mapIcon;
};

TourSchema.methods.deletePlace = function(placeId: string) {
    this.places = this.places.filter(item => item.id !== placeId);
    this.connections = this.connections.filter(item => item.startPlaceId !== placeId && item.endPlaceId !== placeId);
};

const TourModel = mongoose.model<Tour>("Tour", TourSchema);

export default TourModel;
