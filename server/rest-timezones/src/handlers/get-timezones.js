import Joi          from 'joi';
import { omit }     from 'lodash';
import { Router }   from 'express';

import { timezone }         from '../../../module-schemas';
import { verifyToken }      from '../../../module-jwt';

const router        = new Router();
const {Timezone}    = timezone;
const fieldsToOmit  = [];

const getTimezones = (req, res, next) => {
	Timezone.find({}).populate('userId')
		.then(function (result) {
			result = result.map(v => omit(v.toObject(), fieldsToOmit));
			res.status(200).send(result);
		})
		.catch(function (err) {
			next(err);
		});
};

router.get('/v1/timezones/all', verifyToken, getTimezones);

export default router;