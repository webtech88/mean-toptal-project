import '../../../test/bootstrap';

import should   from 'should';
import request  from 'supertest';
import {omit}   from 'lodash';
import {timezone} from '../../../module-schemas';
import app      from '../../../app';
import {generateTimezone} from '../../../module-testhelpers';

const {Timezone} = timezone;

describe("[DELETE] /v1/timezone/:id", function() {
	this.timeout(20000);

	let timezone        = null;
	let id              = null;
	let authToken       = null;

    beforeEach(function(done){
        timezone    = generateTimezone();        
        authToken   = global.authToken;

        delete timezone.updateDate;
        
        Timezone.create(timezone, (err, result) => {
            id = result._id;
            done();
        });
	});

	it('Should delete timezone', function(done){
		request(app)
			.delete(`/v1/timezone/${id}`)
			.set('x-access-token', authToken)
			.expect(200)
			.expect(({}) => {
                should.exist({});
			})
			.end(done);
	});
});