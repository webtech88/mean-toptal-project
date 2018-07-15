import Joi from 'joi';
import {Router} from 'express';
import nodemailer from 'nodemailer';
import {omit, without, pick} from 'lodash';
import {user} from '../../../module-schemas';
import {issueToken} from '../../../module-jwt';
import {hash} from '../../../module-crypto';
import {validateRequest} from '../../../module-middlewares';
import {UnprocessableEntityError} from '../../../module-errors';

const router = new Router();
const {User, types} = user;
const allowedTypes = without(types, 'admin');
const fieldsToOmit = ['password'];
const allowedFields = [
    'firstName',
    'lastName',
    'password',
    'email',
    'type'
];

const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(8).max(30).required(),
    email: Joi.string().email().required(),
    type: Joi.string().valid(allowedTypes)
};


const registerUser = (req, res, next) => {
    let payload = pick(req.body, allowedFields);
    const query = {email: payload.email};

    User.findOne(query, (err, result) => {
        if(err) return next(err);
        if(result)
            return next(new UnprocessableEntityError('User with this email already exists.'));

        payload.password = hash(payload.password);

        User.create(payload, (err, result) => {
            if(err) return next(err);
            result = result.toObject();
            result = omit(result, fieldsToOmit);

            const {_id, email}   = result;
            const payload       = {_id, email};

            issueToken(payload, (err, token) => {
                if(err) return next(err);

                // send verify email
                const trasporter = nodemailer.createTransport({
                    service: 'Yandex',
                    auth: {
                        user: 'ilhyok89@yandex.com',
                        pass: 'yan123456789'
                    }
                });

                let mailOptions = {
                    from: 'ilhyok89@yandex.com',
                    to: payload.email,
                    subject: 'Verify your account',
                    text: 'Please click follow link to verify your account: http://localhost:4200/verify?t=' + token
                }

                trasporter.sendMail(mailOptions, function(error, info){
                    if(error) return next(err);
                });
            });

            res.status(201).send(result);
        });
    });
};





router.post('/v1/users', validateRequest(schema), registerUser);





export default router;
