import Joi                  from 'joi';
import request              from 'request';
import { waterfall }        from 'async';
import { without, omit }    from 'lodash';
import { Router }           from 'express';

import { user }             from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { issueToken }       from '../../../module-jwt';

const router        = new Router();
const {User, types} = user;
const allowedTypes  = without(types, 'admin');
const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];


const schema = {
	accessToken: Joi.string().required()
};


const authorizeFacebook = (req, res, next) => {
	const {accessToken} = req.body;

	const tasks = [
		function (cb) {
			const options = {
				uri: 'https://graph.facebook.com/v2.11/me',
				json: true,
				qs: {
					access_token: accessToken,
					fields: 'first_name,last_name,picture,email'
				}
			};

			request(options, function(err, response, body){
				if(err) return cb(err);

				let doc = {
					status: 'active',
					facebook: {
						accessToken,
						userId: body.id
					}
				};
				
				if(body.first_name) doc.firstName = body.first_name;
				if(body.last_name) doc.lastName = body.last_name;
				if(body.email) doc.email = body.email;
				if(body.picture) doc.photo = body.picture.data.url;

				cb(null, doc);
			});
		},

		//Check if user is already registered with us via facebook
		function (doc, cb) {
			const query = {'facebook.userId': doc.facebook.userId};

			User.findOne(query, function(err, result){
				if(err) return cb(err);
				cb(null, doc, result);
			});
		},

		//If user isn't already registered create her account
		function (doc, result, cb) {
			if(result) return cb(null, result);

			User.create(doc, function(err, result){
				if(err) return cb(err);
				cb(null, result);
			});
		},

		function (result, cb) {
			result              = result.toObject();
			const {_id, type}   = result;
			const payload       = {_id, type};

			issueToken(payload, function(err, token){
				if(err) return cb(err);
				cb(null, result, token);
			});
		}
	];

	waterfall(tasks, function(err, result, token){
		if(err) return next(err);

		const userDetails   = omit(result, fieldsToOmit);
		const responseBody  = {user: userDetails, token};

		res.set('x-user-type', result.type);
		res.status(201).send(responseBody);
	});
};





router.post('/v1/users/authorize/facebook', validateRequest(schema), authorizeFacebook);





export default router;
