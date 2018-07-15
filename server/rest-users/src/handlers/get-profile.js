import Joi          from 'joi';
import { omit }     from 'lodash';
import { Router }   from 'express';

import { user }             from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { verifyToken }      from '../../../module-jwt';

const router        = new Router();
const {User}        = user;
const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];


const getProfile = (req, res, next) => {
	const { _id, type } = req.token.payload;
	
	User.findById(_id, function (err, result) {
		if(err) return next(err);
		result = omit(result.toObject(), fieldsToOmit);
		res.status(200).send(result);
	});
};

router.get('/v1/users/profile', verifyToken, getProfile);

export default router;