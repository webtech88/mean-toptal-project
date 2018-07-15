import '../../../test/bootstrap';

import should   from 'should';
import request  from 'supertest';
import {omit}   from 'lodash';
import {user} from '../../../module-schemas';
import app      from '../../../app';
import {generateUser} from '../../../module-testhelpers';

const {User} = user;

describe("[DELETE] /v1/user/:userId", function() {
	this.timeout(20000);

	let user            = null;
	let userId          = null;
	let authToken       = null;

    beforeEach(function(done){
        user        = generateUser();        
        authToken   = global.authToken;

        delete user.status;
        delete user.wrongCount;
        delete user.dateCreated;
        
        User.create(user, (err, result) => {
            userId = result._id;
            done();
        });
	});

	it('Should delete user', function(done){
		request(app)
			.delete(`/v1/user/${userId}`)
			.set('x-access-token', authToken)
			.expect(200)
			.expect(({}) => {
                should.exist({});
			})
			.end(done);
	});
});