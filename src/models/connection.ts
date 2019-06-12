import mongoose from "mongoose";
import { Connection, ConnectionDto, ConnectionDetailDto } from "./interfaces/connection";
import { Tour } from "./interfaces/tour";

const ConnectionSchema = new mongoose.Schema<Connection>({
    startPlaceId: { type: String, required: true },
    endPlaceId: { type: String, required: true },
    // TODO: add restrictions from 0 to 359
    // in angles
    startPlacePosition: { type: Number, default: 0, min: 0, max: 359 },
    // in angles
    endPlacePosition: { type: Number, default: 0, min: 0, max: 359 }
});

ConnectionSchema.methods.toClient = function (tour: Tour): ConnectionDto {
    const startPlace = tour.getPlace(this.startPlaceId).toClient();
    const endPlace = tour.getPlace(this.endPlaceId).toClient();

    const dto = {
        id: this.id,
        startPlace,
        endPlace,
        startPlacePosition: this.startPlacePosition,
        endPlacePosition: this.endPlacePosition,
    };

    return dto;
};

ConnectionSchema.methods.startAsDestination = function (tour: Tour): ConnectionDetailDto {
    const start = tour.getPlace(this.startPlaceId);

    return {
        id: this.id,
        placeId: start.id,
        name: start.name,
        latitude: start.latitude,
        longitude: start.longitude,
        image360Name: start.image360 && start.image360.filename,
        position: this.endPlacePosition,
        coverName: start.cover && start.cover.filename,
    };
};

ConnectionSchema.methods.endAsDestination = function (tour: Tour): ConnectionDetailDto {
    const end = tour.getPlace(this.endPlaceId)

    return {
        id: this.id,
        placeId: end.id,
        name: end.name,
        latitude: end.latitude,
        longitude: end.longitude,
        image360Name: end.image360 && end.image360.filename,
        position: this.startPlacePosition,
        coverName: end.cover && end.cover.filename,
    };
};

ConnectionSchema.methods.equals = function (place1Id: string, place2Id: string): boolean {
    return (this.startPlaceId === place1Id && this.endPlaceId === place2Id) ||
        (this.startPlaceId === place2Id && this.endPlaceId === place1Id);
};

export default ConnectionSchema;