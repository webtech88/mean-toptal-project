import Joi                  from 'joi';
import { omit }             from 'lodash';
import { Router }           from 'express';

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

const schema = {
	userId      : Joi.string().required()
};

const updateUserStatus = (req, res, next) => {
    const {userId}  = req.body;
    
	User.findByIdAndUpdate(userId, {wrongCount: 0}, {}, function (err, result) {
        if(err) return next(err);
        
        if (result) {
            result = omit(result.toObject(), fieldsToOmit);
        }
		res.status(200).send(result);
	});
};

router.put('/v1/users/restore', verifyToken, validateRequest(schema), updateUserStatus);

export default router;
