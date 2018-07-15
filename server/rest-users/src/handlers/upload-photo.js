import { Router }               from 'express';
import fs                       from 'fs';
import path                     from 'path';
import multiparty               from 'connect-multiparty';
import { omit }                 from 'lodash';

import { BadRequestError }  	from '../../../module-errors';
import { verifyToken }          from '../../../module-jwt';
import { get }                  from '../../../module-config';
import { user }                 from '../../../module-schemas';

const router                    = new Router();
const {User}                    = user;
const multipartyMiddleware      = multiparty();
const hostName                  = get('host');

const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];

const uploadUserPhoto = (req, res, next) => {
    const file = req.files.file;
    if(req.body.type === undefined)
        req.body.type = 'IMAGE';

    if(req.files.file === undefined)
        return next(new BadRequestError('Photo upload failed.'));


    fs.readFile(file.path, function (err, data) {

        if (err) return next(err); 

        const userId    = req.token.payload._id;
        const fileName  = userId + file.originalFilename.substring(file.originalFilename.indexOf('.'), file.originalFilename.length);
        const filePath  = path.join(__dirname, '../../../avatars', fileName);
        const realPath  = hostName+'/avatars/'+fileName;

        fs.writeFile(filePath, data, function(err) {
            if(err) { return next(err) };

            User.findByIdAndUpdate(userId, {photo: realPath}, {}, function (err, result) {
                if(err) return next(err);
                
                result = {
                    photo: realPath
                }
                res.status(200).send(result);
            });
            
        });       
    });
};

router.post('/v1/users/photo', verifyToken, multipartyMiddleware, uploadUserPhoto);

export default router;
