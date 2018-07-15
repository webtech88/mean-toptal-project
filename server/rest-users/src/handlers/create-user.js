import Joi from 'joi';
import {Router} from 'express';
import {omit, without, pick} from 'lodash';

import {user} from '../../../module-schemas';
import {hash} from '../../../module-crypto';
import {validateRequest} from '../../../module-middlewares';
import {UnprocessableEntityError} from '../../../module-errors';
import { verifyToken } from '../../../module-jwt';

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


const createUser = (req, res, next) => {
    let payload = pick(req.body, allowedFields);
    const query = {email: payload.email};

    User.findOne(query, (err, result) => {
        if(err) return next(err);
        if(result)
            return next(new UnprocessableEntityError('User with this email already exists.'));

        payload.password = hash(payload.password);
        payload.status = 'active';

        User.create(payload, (err, result) => {
            if(err) return next(err);
            result = result.toObject();
            result = omit(result, fieldsToOmit);
            res.status(201).send(result);            
        });
    });
};


router.post('/v1/user/new', verifyToken, validateRequest(schema), createUser);

export default router;
