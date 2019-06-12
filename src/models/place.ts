import mongoose from "mongoose";
import { Place, Tour, TourDetailDto, PlaceDetailDto, PlaceDto } from "./interfaces";
// const Widget = new mongoose.Schema({
//     type: { type: String, required: true },
// });

const PlaceSchema = new mongoose.Schema<Place>({
    name: { type: String, required: true },
    longitude: { type: Number, required: true, default: 0 },
    latitude: { type: Number, required: true, default: 0 },
    sound: { filename: String, contentType: String },
    image360: {
        filename: String,
        contentType: String,
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    mapIcon: {
        filename: String,
        contentType: String,
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    cover: {
        filename: String,
        contentType: String,
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    description: { type: String, default: '' },
    widgets: [Object],
});

PlaceSchema.methods.getWidget = function (widgetId) {
    const widget = (this.widgets || []).find(widget => widget.id === widgetId);
    return widget;
};

PlaceSchema.methods.toClient = function () {
    const dto: PlaceDto = {
        id: this.id,
        name: this.name,
        latitude: this.latitude,
        longitude: this.longitude,
        hasImage360: this.image360 && this.image360.filename != null,
        image360Width: this.image360 && this.image360.width,
        image360Height: this.image360 && this.image360.height,
        image360Name: this.image360 && this.image360.filename,
        mapIcon: this.mapIcon,
    };

    return dto;
};

PlaceSchema.methods.toDetailDto = function (tour: Tour): PlaceDetailDto {
    const starts = (tour.connections || []).filter(c => c.startPlaceId === this.id).map(c => c.endAsDestination(tour));
    const ends = (tour.connections || []).filter(c => c.endPlaceId === this.id).map(c => c.startAsDestination(tour));

    const dto: PlaceDetailDto = {
        id: this.id,
        name: this.name,
        latitude: this.latitude,
        longitude: this.longitude,
        hasImage360: this.image360 && this.image360.filename != null,
        image360Width: this.image360 && this.image360.width,
        image360Height: this.image360 && this.image360.height,
        image360Name: this.image360 && this.image360.filename,
        mapIcon: this.mapIcon,
        cover: this.cover,
        soundName: this.sound && this.sound.filename,
        connections: [...starts, ...ends],
        widgets: this.widgets,
        description: this.description,
    };

    return dto;
};

export default PlaceSchema;
