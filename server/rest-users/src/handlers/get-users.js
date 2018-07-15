import Joi          from 'joi';
import { omit }     from 'lodash';
import { Router }   from 'express';

import { user }             from '../../../module-schemas';
import { verifyToken }      from '../../../module-jwt';

const router        = new Router();
const {User}        = user;
const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];

const getUsers = (req, res, next) => {

	User.find({}, function (err, result) {
        if(err) return next(err);
        if (result) {
			result = result.map(v => omit(v.toObject(), fieldsToOmit));
		}
		res.status(200).send(result);
	});
};

router.get('/v1/users', verifyToken, getUsers);

export default router;