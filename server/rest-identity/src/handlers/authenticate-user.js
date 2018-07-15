import Joi      from 'joi';
import {Router} from 'express';
import {omit}   from 'lodash';

import {user}               from '../../../module-schemas';
import {compare}            from '../../../module-crypto';
import {issueToken}         from '../../../module-jwt';
import {validateRequest}    from '../../../module-middlewares';
import {UnauthorizedError}  from '../../../module-errors';

const router            = new Router();
const {User}            = user;
const fieldsToOmit      = [
    'password',
    'facebook',
    'google'
];

const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required()
};

const authenticate = (req, res, next) => {
    const {email, password} = req.body;

    const query = {email};

    User.findOne(query, (err, result) => {
        if(err) return next(err);
        if(!result) return next(new UnauthorizedError('User does not exist'));

        if(result.wrongCount >= 3) {
            return next(new UnauthorizedError('Your account is blocked. Please contact to admin'));
        }

        const valid = compare(password, result.password);

        if(!valid) {
            if (result.type === 'user') {
                User.findByIdAndUpdate(result._id, {wrongCount: result.wrongCount+1}, {}, function (err, result) {
                    if(err) return next(err);
                    return next(new UnauthorizedError('Invalid password'));
                });     
            } else {
                return next(new UnauthorizedError('Invalid password'));
            }
        } else {
            
            if(result.status === 'inactive') {
                return next(new UnauthorizedError('Not verifiyed yet. Please check your email.'));
            }

            result              = result.toObject();
            const {_id, type}   = result;
            const payload       = {_id, type};

            issueToken(payload, (err, token) => {
                if(err) return next(err);

                const userDetails   = omit(result, fieldsToOmit);
                const responseBody  = {user: userDetails, token};

                res.set('x-user-type', type);
                res.status(200).send(responseBody);
            });
        }
    });
};





router.post('/v1/users/authenticate', validateRequest(schema), authenticate);





export default router;