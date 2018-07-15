import Joi                  from 'joi';
import GoogleAuth           from 'google-auth-library';
import { Router }           from 'express';
import { without, omit }    from 'lodash';
import { waterfall }        from 'async';

import { user }             from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { issueToken }       from '../../../module-jwt';
import { get }              from '../../../module-config';

const router        = new Router();
const {User, types} = user;
const clientId      = get('google_client_id');
const auth          = new GoogleAuth();
const client        = new auth.OAuth2(clientId, '', '');
const allowedTypes  = without(types, 'admin');
const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];

const schema = {
	accessToken: Joi.string().required()
};

const authorizeGoogle = (req, res, next) => {
	const {accessToken} = req.body;
	
	const tasks = [
		function (cb) {
			client.verifyIdToken(accessToken, clientId, function (err, verifiedToken) {
				if(err) return cb(err);

				const data = verifiedToken.getPayload();
				let doc = {
					status: 'active',
					google: {
						accessToken,
						userId: data.sub
					}
				};

				if(data.given_name) doc.firstName = data.given_name;
				if(data.family_name) doc.lastName = data.family_name;
				if(data.email) doc.email = data.email;
				if(data.picture) doc.photo = data.picture;

				cb(null, doc);
			});
		},

		function (doc, cb) {
			const query = {'google.userId': doc.google.userId};

			User.findOne(query, function (err, result) {
				if(err) return cb(err);
				cb(null, doc, result);
			});
		},

		function (doc, result, cb) {
			if(result) return cb(null, result);

			User.create(doc, function (err, result) {
				if(err) return cb(err);
				cb(null, result);
			});
		},

		function (result, cb) {
			result              = result.toObject();
			const {_id, type}   = result;
			const payload       = {_id, type};

			issueToken(payload, function (err, token) {
				if(err) return cb(err);
				cb(null, result, token);
			});
		}
	];

	waterfall(tasks, function (err, result, token) {
		if(err) return next(err);

		const userDetails   = omit(result, fieldsToOmit);
		const responseBody  = {user: userDetails, token};

		res.set('x-user-type', result.type);
		res.status(201).send(responseBody);
	});
};





router.post('/v1/users/authorize/google', validateRequest(schema), authorizeGoogle);





export default router;
