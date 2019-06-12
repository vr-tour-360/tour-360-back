import fs from 'fs-extra';
import path from 'path';
import uuidv1 from 'uuidv1';
import { UploadedFile } from 'express-fileupload';
import { Place, Tour } from './../models/interfaces';

function addFile(filename: string, file) {
    const filepath = getFilePath(filename);

    return fs.writeFile(filepath, new Buffer(file.data, "binary"));
}

function removeFile(filename: string) {
    const filepath = getFilePath(filename);
    return fs.pathExists(filename).then((isExists) => {
        if (isExists) {
            return fs.unlink(filepath);
        }
    })
}

function getFilePath(filename: string) {
    return `${__dirname}\\..\\..\\public\\${filename}`;
}

function generatePlaceImage360Name(place: Place, mapImage: UploadedFile): string {
    const extension = path.extname(mapImage.name);
    const newFileName = `${place.id}-${uuidv1()}-place-360${extension}`;

    return newFileName;
}

function generatePlaceCoverName(place: Place, cover: UploadedFile): string {
    const extension = path.extname(cover.name);
    const newFileName = `${place.id}-${uuidv1()}-place-cover${extension}`;

    return newFileName;
}

function generatePlaceMapIconName(place: Place, mapIcon: UploadedFile) {
    const extension = path.extname(mapIcon.name);
    const newFileName = `${place.id}-${uuidv1()}-map-icon${extension}`;

    return newFileName;
}

function generateTourImageName(tour: Tour, mapImage: UploadedFile): string {
    const extension = path.extname(mapImage.name);
    const newFileName = `${tour.id}-${uuidv1()}-map${extension}`;

    return newFileName;
}

function generatePlaceSoundName(place: Place, sound: UploadedFile): string {
    const extension = path.extname(sound.name);
    const newFileName = `${place.id}-${uuidv1()}-sound${extension}`;

    return newFileName;
}

function generateMediaFileName(place: Place, mediaFile: any): string {
    const extension = path.extname(mediaFile.name);
    const newFileName = `${place.id}-${uuidv1()}-media-file${extension}`;

    return newFileName;
}

export {
    addFile,
    removeFile,
    getFilePath,
    generatePlaceImage360Name,
    generatePlaceCoverName,
    generatePlaceMapIconName,
    generateTourImageName,
    generatePlaceSoundName,
    generateMediaFileName,
}
