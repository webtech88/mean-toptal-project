import Joi          from 'joi';
import { omit }     from 'lodash';
import { Router }   from 'express';

import { timezone }         from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { verifyToken }      from '../../../module-jwt';

const router        = new Router();
const {Timezone}        = timezone;
const fieldsToOmit  = [];

const schema = {
	id: Joi.string().required()
};

const getTimezone = (req, res, next) => {
	const {id} = req.params;

	Timezone.findById(id, function (err, result) {
		if(err) return next(err);
		result = omit(result.toObject(), fieldsToOmit);
		res.status(200).send(result);
	});
};

router.get('/v1/timezone/:id', verifyToken, validateRequest(schema), getTimezone);

export default router;