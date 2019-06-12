import { Tour } from './../models';
import path from 'path';
import uuidv1 from 'uuidv1';
import HttpStatus from 'http-status-codes';
import { addFile, removeFile } from '../utils/fileutils';
import { Request as _Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';

type Request = _Request & { userId: string };

export function getAllPublic(req: Request, res: Response) {
    Tour.find({ isPublic: true })
        .populate('createdBy')
        .then((tours) => {
            const dtos = tours.map(tour => tour.toClient());
            return res.json({ tours: dtos })
        })
}

export function getAll(req: Request, res: Response) {
    Tour.find({ createdBy: req.userId })
        .populate('createdBy')
        .then((tours) => {
            const dtos = tours.map(tour => tour.toClient());
            return res.json({ tours: dtos });
        }).catch(err => {
            return res.json({ error: err });
        })
};

export function getById(req: Request, res: Response) {
    const { id } = req.params;

    if (id == null) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: "id should be provided" });
    }

    Tour.findById(id)
        .populate('createdBy')
        .then(tour => {
            return res.json({ tour: tour.toDetailDto() });
        })
        .catch(error => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        });
};

export function getPlace(req: Request, res: Response) {
    const { id, placeId } = req.params;

    if (id == null) {
        res.status(HttpStatus.BAD_REQUEST).send("id should be provided");
    } else if (placeId == null) {
        res.status(HttpStatus.BAD_REQUEST).send("placeId should be provided");
    }

    Tour.findById(id)
        .populate('createdBy')
        .then(tour => {
            const index = tour.places.findIndex((value) => value.id === placeId);
            const place = tour.places[index].toDetailDto(tour);

            return res.json({ place })
        });
};

export function create(req: Request, res: Response) {
    const { name, mapType } = req.body;

    if (!name) {
        return res.json({ error: "Name should be provided" });
    }

    const tour = new Tour({
        name,
        mapType,
        createdBy: req.userId,
    });

    tour.save().then(() => {
        return res.json({ tour: tour.toClient() });
    }).catch((error) => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    });
};

export function uploadCover(req: Request, res: Response) {
    const { id } = req.params;
    if (id == null) {
        res.json({ error: "id should be provided" });
    }

    if (Object.keys(req.files).length == 0) {
        return res.status(HttpStatus.BAD_REQUEST).send('No files were uploaded.');
    }

    let tour = null;
    let newFileName = null;
    const cover = <UploadedFile>req.files.cover;

    Tour.findById(id)
        .populate('createdBy')
        .then((t) => {
            tour = t;
            const removePromise = t.cover && t.cover.filename != null ? removeFile(t.cover.filename) : Promise.resolve();
            return removePromise;
        }).then(() => {
            const extension = path.extname(cover.name);
            newFileName = `${tour.id}-${uuidv1()}-cover${extension}`;

            return addFile(newFileName, cover);
        }).then(() => {
            return Tour.findOneAndUpdate({ _id: id }, {
                $set: {
                    cover: {
                        filename: newFileName,
                        contentType: cover.mimetype,
                    }
                }
            }, { new: true })
                .populate('createdBy');
        }).then((tour) => {
            return res.json({ tour: tour.toDetailDto() });
        }).catch((error) => {
            return res.json({ error });
        });
};

export function deleteTour(req: Request, res: Response) {
    const { id } = req.params;
    Tour.findOneAndDelete(id, error => {
        if (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error });
        } else {
            return res.json({});
        }
    });
};
