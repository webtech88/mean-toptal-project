import '../../../test/bootstrap';

import should   from 'should';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';

describe("[GET] /v1/timezones/all", function() {
	this.timeout(20000);

	let timezone        = null;
	let authToken       = null;

	beforeEach(function(){
        timezone        = global.timezone;
        timezone.userId = global.user;
		authToken       = global.authToken;
	});

	it('Should get timezones detail', function(done){
		request(app)
			.get(`/v1/timezones/all`)
			.set('x-access-token', authToken)
			.expect(200)
			.expect(({body}) => {
				const expected = timezone;
				should.deepEqual(body, [expected]);
			})
			.end(done);
	});
});