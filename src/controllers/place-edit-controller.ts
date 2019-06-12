import uuidv1 from 'uuidv1';
import { NOT_FOUND, OK, INTERNAL_SERVER_ERROR, NO_CONTENT } from 'http-status-codes';
import { cache as _cache } from './tour-edit-controller';
import { 
    Tour,
    Place,
    WidgetType,
    TextWidget,
    RunVideoWidget,
    HintWidget,
    ImageWidget
} from './../models/interfaces';
import { Request, Response } from 'express';
import {
    addFile,
    generateMediaFileName,
    removeFile,
} from '../utils/fileutils';
import { UploadedFile } from 'express-fileupload';

interface PlaceEditCache {
    tourSessionId: string;
    place: Place;
    userId: string;
}

const cache: { [key: string]: PlaceEditCache } = {};

export function get(req, res) {
    const { sessionId } = req.params;
    const { place, tourSessionId } = cache[sessionId];
    const tour = _cache[tourSessionId];

    if (place) {
        res.json({
            sessionId,
            tourSessionId,
            place: place.toDetailDto(tour)
        });
    } else {
        res.status(NOT_FOUND).send("Session not found");
    }
}

export function startEditing(req, res) {
    const { tourSessionId, placeId } = req.body;

    const tour = _cache[tourSessionId];
    const place = tour.getPlace(placeId);

    if (place) {
        const sessionId = uuidv1();

        cache[sessionId] = {
            place,
            userId: req.userId,
            tourSessionId,
        };

        res.json({
            sessionId,
            tourSessionId,
            place: place.toDetailDto(tour),
        });
    } else {
        res.status(NOT_FOUND).json({ error: 'place not found' });
    }
}

export function addWidget(req: Request, res: Response) {
    const { sessionId } = req.params;
    const { type, x, y } = req.body;
    let { place, tourSessionId } = cache[sessionId];
    const tour = _cache[tourSessionId];

    const widget = createWidget(type, x, y);
    place.widgets.push(widget);

    res.json({
        widgetId: widget.id,
        sessionId,
        tourSessionId,
        place: place.toDetailDto(tour),
    });
}

export function cancelChanges(req: Request, res: Response) {
    const { sessionId } = req.params;
    const placeEditSession = cache[sessionId];

    if (placeEditSession) {
        const { tourSessionId } = placeEditSession;
        delete cache[sessionId];
        delete _cache[tourSessionId];

        res.status(OK).json({});
    } else {
        res.status(NOT_FOUND).json({});
    }
}

export function saveChanges(req: Request, res: Response) {
    const { sessionId } = req.params;
    let { tourSessionId, place } = cache[sessionId];
    const tour = _cache[tourSessionId];

    const updateData = req.body;

    place.name = updateData.name;
    place.longitude = updateData.longitude;
    place.latitude = updateData.latitude;
    place.description = updateData.description;
    place.widgets = updateData.widgets;
    place.markModified('widgets');
    place.mapIcon = updateData.mapIcon;

    tour.save().then(() => {
        res.json({
            sessionId,
            tourId: tour.id,
            place: place.toDetailDto(tour),
        });
    }).catch((error) => {
        res.status(INTERNAL_SERVER_ERROR).json({ error });
    });
}

export function updateRunVideo(req: Request, res: Response) {
    const { sessionId } = req.params;
    let { place } = cache[sessionId];
    // const mapImage = <UploadedFile>req.files.mapImage;

    const { widget, video } = req.body;

    const newFileName = generateMediaFileName(place, video);
    addFile(newFileName, video).then(() => {
        video.filename = newFileName

        res.json({ widget, video });
    }).catch(error => {
        res.status(INTERNAL_SERVER_ERROR).json({ error });
    });
}

export function removeRunVideo(req: Request, res: Response) {
    const { sessionId, widgetId } = req.params;
    let { place } = cache[sessionId];
    const widget = place.getWidget<RunVideoWidget>(widgetId);

    if (widget && widget.video && widget.video.filename) {
        removeFile(widget.video.filename).then(() => {
            widget.video = null;
        }).catch((error) => {
            res.status(INTERNAL_SERVER_ERROR).json({ error });
        });
    } else {
        res.status(NO_CONTENT).json({ widget });
    }
}

export function updateImageWidget(req: Request, res: Response) {
    const { sessionId, widgetID } = req.params;
    let { place } = cache[sessionId];
    const { image } = req.files;
    
    const newFileName = generateMediaFileName(place, image);

    // It's necessary because type 'UploadedFile' doesn't have property 'filename'
    // Typescript is pain :/
    var imageCopy = JSON.parse(JSON.stringify(image));
    imageCopy.filename = newFileName;

    addFile(newFileName, image).then(() => {
        const widget = place.widgets.find(item => item.id === widgetID) as ImageWidget;
        widget.image = imageCopy;

        res.json({ widget, imageCopy });
    }).catch(error => {
        res.status(INTERNAL_SERVER_ERROR).json({ error });
    });
}

export function removeImageFromImageWidget(req: Request, res: Response) {
    const { sessionId, widgetId } = req.params;
    let { place } = cache[sessionId];
    const widget = place.getWidget<ImageWidget>(widgetId);

    if (widget && widget.image && widget.image.filename) {
        removeFile(widget.image.filename).then(() => {
            widget.image = null;
        }).catch((error) => {
            res.status(INTERNAL_SERVER_ERROR).json({ error });
        });
    } else {
        res.status(NO_CONTENT).json({ widget });
    }
}

function createWidget(type: WidgetType, x: number, y: number) {
    if (type === 'text') {
        const widget: TextWidget = {
            id: uuidv1(),
            x,
            y,
            content: '[Enter your text]',
            type,
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: 0,
        };
        return widget;
    } else if (type === 'run-video') {
        const widget: RunVideoWidget = {
            id: uuidv1(),
            x,
            y,
            name: 'Video Widget',
            muted: false,
            type,
            volume: 0.5,
            video: null,
        };
        return widget;
    } else if (type === 'hint') {
        const widget: HintWidget = {
            id: uuidv1(),
            x,
            y,
            content: '[Enter your text]',
            type
        };
        return widget;
    } else if (type === 'image') {
        const widget: ImageWidget = {
            id: uuidv1(),
            x,
            y,
            width: 100,
            height: 100,
            type,
            image: null,
            name: 'Image Widget'
        };
        return widget;
    } else {
        throw new Error('Unknown widget type');
    }
}