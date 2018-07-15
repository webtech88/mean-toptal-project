import '../../../test/bootstrap';

import should   from 'should';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';

describe("[GET] /v1/timezones", function() {
	this.timeout(20000);

	let timezone        = null;
	let authToken       = null;

	beforeEach(function(){
        timezone        = global.timezone;
		authToken       = global.authToken;
	});

	it('Should get timezones of user', function(done){
		request(app)
			.get(`/v1/timezones`)
			.set('x-access-token', authToken)
			.expect(200)
			.expect(({body}) => {
				const expected = timezone;
				should.deepEqual(body, [expected]);
			})
			.end(done);
	});
});