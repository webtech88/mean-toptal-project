import '../../../test/bootstrap';

import should from 'should';
import Chance from 'chance';
import {without} from 'lodash';
import request from 'supertest';
import {timezone} from '../../../module-schemas';
import {generateTimezone} from '../../../module-testhelpers';
import app from '../../../app';

const {Timezone} = timezone;
const random = new Chance();

describe("[POST] /v1/timezone", function() {
    this.timeout(20000);

    let payload     = null;
    let authToken   = null;
    let id         = null;

    beforeEach(() => {
        authToken = global.authToken;
        payload = generateTimezone();
        delete payload.updateDate;
    });

    afterEach((done) => {
        if(!id) return done();
        Timezone.findByIdAndRemove(id, done);
    });

    function shouldReturnValidationError(payload, key, done){
        request(app)
            .post('/v1/timezone')
            .set('x-access-token', authToken)
            .send(payload)
            .expect(422)
            .expect(({body}) => {
                body.name.should.equal('ValidationError');
                body.details[0].path.should.equal(key);
            })
            .end(done);
    }

    it('Should successfully create new timezone', (done) => {
        request(app)
            .post('/v1/timezone')
            .set('x-access-token', authToken)
            .send(payload)
            .expect(201)
            .expect(({body}) => {
                should.exist(body);
                delete payload.password;
                const {_id, updateDate, timezone} = body;
                id = _id;
                payload = Object.assign(payload, {_id, updateDate, timezone});
                should.deepEqual(body, payload);
            })
            .end(done);
    });

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

});