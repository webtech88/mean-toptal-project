import Joi                  from 'joi';
import { pick, omit, each } from 'lodash';
import { Router }           from 'express';

import { user }             from '../../../module-schemas';
import {compare, hash}            from '../../../module-crypto';
import { validateRequest }  from '../../../module-middlewares';
import { verifyToken }      from '../../../module-jwt';
import {UnauthorizedError}  from '../../../module-errors';


const router        = new Router();
const {User}        = user;
const allowedFields = [
	'old_password',
	'password'
];
const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];

const schema = {
	userId      : Joi.string().required()
};

const resetUserPassword = (req, res, next) => {
	const {userId}  = req.params;
    const payload   = pick(req.body, allowedFields);
    let promise     = Promise.resolve();

    if (payload.old_password) {
        promise = new Promise((resolve, reject) => {
            User.findOne({_id: userId}, (err, result) => {
                if(err) return reject(err);
                if(!result) return reject(new UnauthorizedError('User does not exist'));
        
                const valid = compare(payload.old_password, result.password);
        
                if(!valid) {
                    reject(new UnauthorizedError('Not Matched password'));
                } else {
                    resolve();
                }
            });
        });
    }

    promise.then(() => {
        User.findByIdAndUpdate(userId, {password: hash(payload.password)}, {}, function (err, result) {
            if(err) return next(err);
            
            if (result) {
                result = omit(result.toObject(), fieldsToOmit);
            }
            res.status(200).send(result);
        });
    })
    .catch(err => next(err));
};

router.put('/v1/users/password/:userId', verifyToken, validateRequest(schema), resetUserPassword);

export default router;
