import jwt from 'jsonwebtoken';
import * as config from './../config.js';
import HttpStatus from 'http-status-codes';
import { getTokenFromRequest } from './tokenutils';
import { Request, Response } from 'express';

const verifyToken = (req: Request & { userId: string }, res: Response, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
        return res.status(HttpStatus.FORBIDDEN).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                auth: false,
                message: 'Fail to Authentication. Error -> ' + err
            });
        }
        req.userId = decoded.id;
        next();
    });
}

export {
    verifyToken,
};