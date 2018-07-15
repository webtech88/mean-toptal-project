import '../../../test/bootstrap';

import should   from 'should';
import Chance   from 'chance';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';

const random = new Chance();

describe("[PUT] /v1/users/restore", function() {
	this.timeout(20000);

	let user            = null;
	let authToken       = null;
	let payload         = null;
	const fieldsToOmit  = [
		'password',
		'facebook',
		'google'
	];

	beforeEach(function(){
		user        = global.user;
        authToken   = global.authToken;
        
        payload = {
            userId: user._id
        }
	});

	function shouldReturnValidationError(payload, key, done){
        request(app)
			.put(`/v1/users/restore`)
			.set('x-access-token', authToken)
            .send(payload)
            .expect(422)
            .expect(({body}) => {
                body.name.should.equal('ValidationError');
                body.details[0].path.should.equal(key);
            })
            .end(done);
    }

    it('Should return validation error if userId is not provided', (done) => {
        delete payload.userId;
        shouldReturnValidationError(payload, 'userId', done);
	});

	it('Should update status of user', function(done){
		request(app)
			.put(`/v1/users/restore`)
			.set('x-access-token', authToken)
			.send(payload)
			.expect(200)
			.end(done);
	});
});