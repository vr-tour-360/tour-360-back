import { Types } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { User } from '../models/index';
import { createToken } from '../utils/tokenutils';
import { validateForm, validName, validEmail } from '../utils/validate';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status-codes';
import GoogleRecaptcha from 'google-recaptcha';
import { RECAPTCHA_SECRET_KEY } from '../config';
// import {  } from './../models/interfaces/user';

const googleRecaptcha = new GoogleRecaptcha({ secret: RECAPTCHA_SECRET_KEY });

export function signup(req, res) {
    User.findOne({ email: req.body.user.email }).then((user) => {
        if (user) {
            return res.status(BAD_REQUEST).json({ message: 'Error is occured during registering' });
        }

        hash(req.body.user.password, 10, (err, hash) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json({ error: err });
            }
            const validation = validateForm({
                email: req.body.user.email,
                firstName: req.body.user.firstName,
                lastName: req.body.user.lastName,
                password: hash
            });
            if (!validation.isValid) {
                return res.status(BAD_REQUEST).json({ error: validation.error });
            };

            const user = new User({
                _id: new Types.ObjectId(),
                email: req.body.user.email,
                firstName: req.body.user.firstName,
                lastName: req.body.user.lastName,
                password: hash
            });

            googleRecaptcha.verify({ response: req.body.ReCAPTCHAValue }, (error) => {
                if (error) {
                    return res.status(BAD_REQUEST).json({ message: 'You are not human' });
                };

                user.save().then((result) => {
                    return res.status(OK).json({ user: user.toClient() });
                }).catch(error => {
                    return res.status(INTERNAL_SERVER_ERROR).json({ error });
                });
            });
        });
    })
}

export function signin(req, res) {
    googleRecaptcha.verify({ response: req.body.ReCAPTCHAValue }, (error) => {
        if (error) {
            return res.status(BAD_REQUEST).json({ error: 'You are not human' });
        }

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    return res.state(BAD_REQUEST).json({ error: 'Error occured during login' });
                }

                compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(UNAUTHORIZED).json({ error: 'Unauthorized Access' });
                    }
                    if (result) {
                        const token = createToken(user);
                        return res.status(OK).json({
                            user: user.toClient(),
                            token,
                        });
                    }
                    return res.status(UNAUTHORIZED).json({ error: 'Unauthorized Access' });
                });
            })
            .catch(error => {
                return res.status(INTERNAL_SERVER_ERROR).json({ error });
            });
    });
}

export function editUser(req, res) {
    User.findOne({ _id: req.userId })
        .then((user) => {
            if (user) {
                const { email, firstName, lastName, language } = req.body;

                const emailValidation = validEmail(email);
                const firstNameValidation = validName(firstName);
                const lastNameValidation = validName(lastName);

                if (emailValidation.valid && firstNameValidation.valid && lastNameValidation.valid) {
                    user.email = email;
                    user.firstName = firstName;
                    user.lastName = lastName;
                    user.language = language;
                    user.save();

                    res.status(OK)
                        .json({
                            user: user.toClient(),
                        });
                } else {
                    res.status(BAD_REQUEST).json({
                        emailError: emailValidation.error,
                        firstNameError: firstNameValidation.error,
                        lastNameError: lastNameValidation.error,
                    });
                }
            } else {
                res.status(BAD_REQUEST).json({ message: 'Error is occured during editing' });
            }
        })
        .catch(error => {
            res.status(INTERNAL_SERVER_ERROR).json({ error });
        });
}

export function getUserById(req, res) {
    const { id } = req.params;

    if (id == null) {
        res.status(BAD_REQUEST).json({ error: 'id should be provided' });
    }

    User.findById(id)
        .then(user => {
            return res.json({ user: user.toClient() });
        })
        .catch(error => {
            return res.status(INTERNAL_SERVER_ERROR).json({ error });
        });
}
