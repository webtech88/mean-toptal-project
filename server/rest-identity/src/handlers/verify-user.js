import Joi      from 'joi';
import jwt from 'jsonwebtoken';
import {Router} from 'express';

import {user}               from '../../../module-schemas';
import {validateRequest}    from '../../../module-middlewares';
import * as config          from '../../../module-config';

const router            = new Router();
const {User}            = user;

const schema = {
    verifyToken: Joi.string().required()
};

const emailVerify = (req, res, next) => {
    const {verifyToken} = req.body;

    const secret = config.get('jwt_secret'),
        algorithm = config.get('jwt_algorithm');

    jwt.verify(verifyToken, secret, {algorithm}, (err, token) => {
        if(err) return next(err);

        User.find({email: token.email}).count().then((count) => {
            let promise = Promise.resolve();
            let responseBody  = {verified: false};
            if (count > 0) {
                responseBody.verified = true;
                promise = new Promise((resolve, reject) => {
                    User.findByIdAndUpdate(token._id, {status: 'active'}, {}, function (err, result) {
                        if(err) return reject(err);
                        else resolve(result);
                    });
                })             
            }
            
            promise.then(() => {
                res.status(200).send(responseBody);
            })
            .catch(err => next(err));
        });
    });
};

router.post('/v1/users/verify', validateRequest(schema), emailVerify);

export default router;