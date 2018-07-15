import Joi                  from 'joi';
import tzlookup 			from 'tz-lookup';
import { pick, omit, each } from 'lodash';
import { Router }           from 'express';

import { timezone }         from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { verifyToken }      from '../../../module-jwt';


const router        = new Router();
const {Timezone}        = timezone;
const allowedFields = [
	'name',
	'city',
    'location'
];
const fieldsToOmit  = [];

const schema = {
	name      : Joi.string().required(),
	city      : Joi.string().required(),
    location: Joi.required()
};

const updateTimezone = (req, res, next) => {
	const {id}      = req.params;
	const payload   = pick(req.body, allowedFields);

	payload.timezone = tzlookup(payload.location.lat, payload.location.lng);

	let update  = {$set: {}};
	let options = {new: true};

	each(payload, function (value, key) {
		update.$set[key] = value;
	});

	Timezone.findByIdAndUpdate(id, update, options, function (err, result) {
		if(err) return next(err);
		result = omit(result.toObject(), fieldsToOmit);
		res.status(200).send(result);
	});
};

router.put('/v1/timezone/:id', verifyToken, validateRequest(schema), updateTimezone);

export default router;
