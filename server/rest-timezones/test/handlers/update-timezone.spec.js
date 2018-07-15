import '../../../test/bootstrap';

import should   from 'should';
import Chance   from 'chance';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';

const random = new Chance();

describe("[PUT] /v1/timezone/:id", function() {
	this.timeout(20000);

	let timezone        = null;
	let id              = null;
	let authToken       = null;
	let payload         = null;

	beforeEach(function(){
		timezone    = global.timezone;
		id          = timezone._id;
		authToken   = global.authToken;
		payload     = {
			name        : random.name(),
            city        : random.city(),
            location    : {lat: random.latitude().toString(), lng: random.longitude().toString()}
		}
	});

	function shouldReturnValidationError(payload, key, done){
        request(app)
			.put(`/v1/timezone/${id}`)
			.set('x-access-token', authToken)
            .send(payload)
            .expect(422)
            .expect(({body}) => {
                body.name.should.equal('ValidationError');
                body.details[0].path.should.equal(key);
            })
            .end(done);
    }

	it('Should return validation error if name is not provided', (done) => {
        delete payload.name;
        shouldReturnValidationError(payload, 'name', done);
	});
	
	it('Should return validation error if city is not provided', (done) => {
        delete payload.city;
        shouldReturnValidationError(payload, 'city', done);
    });

    it('Should return validation error if location is not provided', (done) => {
        delete payload.location;
        shouldReturnValidationError(payload, 'location', done);
    });

	it('Should update and get updated timezone detail', function(done){
		request(app)
			.put(`/v1/timezone/${id}`)
			.set('x-access-token', authToken)
			.send(payload)
			.expect(200)
			.end(done);
	});
});