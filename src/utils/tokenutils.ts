import jwt from 'jsonwebtoken';
import * as config from '../config';

export function createToken(user) {
    const token = jwt.sign({
        id: user._id,
    }, config.SECRET_KEY,
        {
            expiresIn: '24h'
        });

    return token;
}

export function getTokenFromRequest(req) {
    // Express headers are auto converted to lowercase
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    return token;
}