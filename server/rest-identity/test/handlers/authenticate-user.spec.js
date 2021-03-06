import '../../../test/bootstrap';

import should from 'should';
import Chance from 'chance';
import {without} from 'lodash';
import request from 'supertest';
import {user} from '../../../module-schemas';
import {hash} from '../../../module-crypto';
import {generateUser} from '../../../module-testhelpers';
import app from '../../../app';

const {User} = user;
const random = new Chance();

describe("[POST] /v1/users/authenticate", function() {
    this.timeout(20000);

    let userId  = null;
    let payload = null;
    let doc = null;

    beforeEach((done) => {
        doc = generateUser();

        payload = {
            email: doc.email,
            password: doc.password
        };

        doc.password = hash(doc.password);

        User.create(doc, (err, result) => {
            if(err) return done(err);
            userId = result._id;
            done();
        });
    });

    afterEach((done) => {
        if(!userId) return done();
        User.findByIdAndRemove(userId, done);
    });

    function shouldReturnValidationError(payload, key, done){
        request(app)
            .post('/v1/users/authenticate')
            .send(payload)
            .expect(422)
            .expect(({body}) => {
                body.name.should.equal('ValidationError');
                body.details[0].path.should.equal(key);
            })
            .end(done);
    }

    function shouldReturnUnauthorizedError(payload, done){
        request(app)
            .post('/v1/users/authenticate')
            .send(payload)
            .expect(401)
            .expect(({body}) => {
                body.name.should.equal('UnauthorizedError');
            })
            .end(done);
    }

    it('Should successfully login and return token if email and password are valid', (done) => {
        request(app)
            .post('/v1/users/authenticate')
            .send(payload)
            .expect(200)
            .expect(({body}) => {
                should.exist(body);
                should.exist(body.token);
            })
            .end(done);
    });

    it('Should return ValidationError if email is not provided', (done) => {
        delete payload.email;
        shouldReturnValidationError(payload, 'email', done);
    });

    it('Should return ValidationError if email is invalid', (done) => {
        payload.email = random.word();
        shouldReturnValidationError(payload, 'email', done);
    });

    it('Should return ValidationError if password is not provided', (done) => {
        delete payload.email;
        shouldReturnValidationError(payload, 'email', done);
    });

    it('Should return UnauthorizedError if email does not exist in database', (done) => {
        payload.email = random.email();
        shouldReturnUnauthorizedError(payload, done);
    });

    it('Should return UnauthorizedError if the account is blocked', (done) => {
        doc.wrongCount = 3;
        User.findByIdAndUpdate(userId, doc, {}, (err, result) => {
            if(err) return done(err);
            shouldReturnUnauthorizedError(payload, done);
        });        
    });

    it('Should return UnauthorizedError if password is incorrect', (done) => {
        payload.password = random.string();
        shouldReturnUnauthorizedError(payload, done);
    });

    it('Should return UnauthorizedError if the account is not verified', (done) => {
        doc.status = 'inactive';
        User.findByIdAndUpdate(userId, doc, {}, (err, result) => {
            if(err) return done(err);
            shouldReturnUnauthorizedError(payload, done);
        });        
    });
});