import Joi from 'joi';
import {Router} from 'express';
import tzlookup from 'tz-lookup';
import {omit, without, pick} from 'lodash';
import {timezone} from '../../../module-schemas';

import {validateRequest}            from '../../../module-middlewares';
import {verifyToken}                from '../../../module-jwt';
import {UnprocessableEntityError}   from '../../../module-errors';

const router = new Router();
const {Timezone} = timezone;

const allowedFields = [
    'name',
    'city',
    'location'
];

const fieldsToOmit = [];

const schema = {
    name: Joi.string().required(),
    city: Joi.string().required(),
    location: Joi.required()
};


const createTimezone = (req, res, next) => {
    
    const {_id} = req.token.payload;

    let payload = pick(req.body, allowedFields);
    payload.userId = _id;
    payload.timezone = tzlookup(payload.location.lat, payload.location.lng);
    
    Timezone.create(payload, (err, result) => {
        if(err) return next(err);

        result = result.toObject();
        result = omit(result, fieldsToOmit);
        res.status(201).send(result);            
    });
};


router.post('/v1/timezone', verifyToken, validateRequest(schema), createTimezone);

export default router;
