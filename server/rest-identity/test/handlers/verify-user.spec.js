import '../../../test/bootstrap';

import should from 'should';
import Chance from 'chance';
import request from 'supertest';
import {user} from '../../../module-schemas';
import app from '../../../app';

const {User} = user;
const random = new Chance();

describe("[POST] /v1/users/verify", function() {
    this.timeout(20000);

    let payload = null;

    it('Should return ValidationError if verifyToken is not provided', (done) => {
        request(app)
            .post('/v1/users/verify')
            .send(payload)
            .expect(422)
            .expect(({body}) => {
                body.name.should.equal('ValidationError');
                body.details[0].path.should.equal('verifyToken');
            })
            .end(done);
    });
});