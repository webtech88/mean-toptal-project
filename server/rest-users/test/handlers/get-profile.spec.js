import '../../../test/bootstrap';

import should   from 'should';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';

describe("[GET] /v1/users/profile", function() {
	this.timeout(20000);

	let authToken       = null;

	const fieldsToOmit  = [
		'password',
		'facebook',
		'google'
	];

	beforeEach(function(){
		authToken   = global.authToken;
	});

	it('Should get profile of user', function(done){
		request(app)
			.get(`/v1/users/profile`)
			.set('x-access-token', authToken)
			.expect(200)
			.expect(({body}) => {
				const expected = omit(user, fieldsToOmit);
				should.deepEqual(body, expected);
			})
			.end(done);
	});
});