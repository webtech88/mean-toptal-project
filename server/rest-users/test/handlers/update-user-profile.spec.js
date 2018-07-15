import '../../../test/bootstrap';

import should   from 'should';
import Chance   from 'chance';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';

const random = new Chance();

describe("[PUT] /v1/users/profile", function() {
	this.timeout(20000);

	let user            = null;
	let userId          = null;
	let authToken       = null;
	let payload         = null;
	const fieldsToOmit  = [
		'password',
		'facebook',
        'google'
	];

	beforeEach(function(){
		user        = global.user;
		userId      = user._id;
        authToken   = global.authToken;
        
		payload     = {
			firstName   : random.first(),
            lastName    : random.last()
		}
	});

	function shouldReturnValidationError(payload, key, done){
        request(app)
			.put(`/v1/users/profile`)
			.set('x-access-token', authToken)
            .send(payload)
            .expect(422)
            .expect(({body}) => {
                body.name.should.equal('ValidationError');
                body.details[0].path.should.equal(key);
            })
            .end(done);
    }

	it('Should return validation error if firstName is not provided', (done) => {
        delete payload.firstName;
        shouldReturnValidationError(payload, 'firstName', done);
	});
	
	it('Should return validation error if lastName is not provided', (done) => {
        delete payload.lastName;
        shouldReturnValidationError(payload, 'lastName', done);
    });

	it('Should update and get updated user detail', function(done){
		request(app)
			.put(`/v1/users/profile`)
			.set('x-access-token', authToken)
			.send(payload)
			.expect(200)
			.expect(({body}) => {
				const expected      = omit(user, fieldsToOmit);
				expected.firstName  = payload.firstName;
                expected.lastName   = payload.lastName;

				should.deepEqual(body, expected);
			})
			.end(done);
	});
});