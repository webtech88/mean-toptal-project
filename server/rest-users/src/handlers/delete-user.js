import Joi              from 'joi';
import { pick, omit }   from 'lodash';
import { Router }       from 'express';

import { user }      from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { verifyToken }      from '../../../module-jwt';


const router        = new Router();
const {User}        = user;

const schema = {
    userId: Joi.string().required()
};

const deleteUser = (req, res, next) => {
    const {userId} = req.params;
    

    User.findByIdAndRemove(userId, (err, result) => {  
        if(err) return next(err);
        res.status(200).send({});
    });
};

router.delete('/v1/user/:userId', verifyToken, validateRequest(schema), deleteUser);

export default router;