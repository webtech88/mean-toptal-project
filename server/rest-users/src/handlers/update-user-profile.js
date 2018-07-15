import Joi                  from 'joi';
import { pick, omit, each } from 'lodash';
import { Router }           from 'express';

import { user }             from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { verifyToken }      from '../../../module-jwt';


const router        = new Router();
const {User}        = user;
const allowedFields = [
	'firstName',
	'lastName'
];
const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];

const schema = {
	firstName   : Joi.string().required(),
    lastName    : Joi.string().required()
};

const updateUserProfile = (req, res, next) => {
    const {_id}  = req.token.payload;
	const payload   = pick(req.body, allowedFields);

	let update  = {$set: {}};
	let options = {new: true};

	each(payload, function (value, key) {
		update.$set[key] = value;
	});

	User.findByIdAndUpdate(_id, update, options, function (err, result) {
        if(err) return next(err);
        
        if (result) {
            result = omit(result.toObject(), fieldsToOmit);
        }
		res.status(200).send(result);
	});
};

router.put('/v1/users/profile', verifyToken, validateRequest(schema), updateUserProfile);

export default router;
