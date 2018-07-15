import Joi          from 'joi';
import { omit }     from 'lodash';
import { Router }   from 'express';

import { timezone }         from '../../../module-schemas';
import { verifyToken }      from '../../../module-jwt';

const router        = new Router();
const {Timezone}    = timezone;
const fieldsToOmit  = [];

const getUserTimezones = (req, res, next) => {
    const {_id} = req.token.payload;

	Timezone.find({userId: _id}, function (err, result) {
        if(err) return next(err);
        
        result = result.map(v => omit(v.toObject(), fieldsToOmit));
		res.status(200).send(result);
	});
};

router.get('/v1/timezones', verifyToken, getUserTimezones);

export default router;