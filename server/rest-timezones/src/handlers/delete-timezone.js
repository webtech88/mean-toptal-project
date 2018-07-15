import Joi              from 'joi';
import { pick, omit }   from 'lodash';
import { Router }       from 'express';

import { timezone }         from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { verifyToken }      from '../../../module-jwt';


const router        = new Router();
const {Timezone}    = timezone;


const schema = {
    id: Joi.string().required()
};


const deleteTimezone = (req, res, next) => {
    const {id} = req.params;
    

    Timezone.findByIdAndRemove(id, (err, result) => {  
        if(err) return next(err);
        res.status(200).send({});
    });
};

router.delete('/v1/timezone/:id', verifyToken, validateRequest(schema), deleteTimezone);

export default router;