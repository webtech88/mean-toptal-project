import '../../../test/bootstrap';

import should   from 'should';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';

describe("[GET] /v1/timezone/:id", function() {
	this.timeout(20000);

	let timezone        = null;
	let id		        = null;
	let authToken       = null;

	beforeEach(function(){
		timezone    = global.timezone;
		id      	= timezone._id;
		authToken   = global.authToken;
	});

	it('Should get timezone detail', function(done){
		request(app)
			.get(`/v1/timezone/${id}`)
			.set('x-access-token', authToken)
			.expect(200)
			.expect(({body}) => {
				const expected = timezone;
				should.deepEqual(body, expected);
			})
			.end(done);
	});
});