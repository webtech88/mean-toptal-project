import '../../test/bootstrap';

import should from 'should';
import Chance from 'chance';
import {timezone} from '../lib';

const random = new Chance();
const {Timezone} = timezone;

describe('timezone', function() {
    this.timeout(20000);

    let doc = null;
    let id = null;

    beforeEach(() => {
        doc = {
            name: random.name(),
            city: random.city(),
            updateDate: random.date(),
            userId: global.user._id,
            location: {lat: random.latitude().toString(), lng: random.longitude().toString()},
            timezone: random.areacode()
        }
    });

    afterEach((done) => {
        if(!id) return done();
        Timezone.findByIdAndRemove(id, done);
    });

    function shouldNotComplain(doc, done) {
        Timezone.create(doc, (err, result) => {
            should.not.exist(err);
            should.exist(result);
            id = result._id;
            done();
        });
    }

    it('Should successfully save a timezone', (done) => {
        Timezone.create(doc, (err, result) => {
            should.not.exist(err);

            result = result.toObject();
            doc.updateDate = result.updateDate;
            doc._id = result._id;
            id = result._id;

            should.deepEqual(result, doc);
            done();
        });
    });

    it('Should not complain if name is not provided', (done) => {
        delete doc.name;
        shouldNotComplain(doc, done);
    });

    it('Should not complain if city is not provided', (done) => {
        delete doc.city;
        shouldNotComplain(doc, done);
    });

    it('Should not complain if userId is not provided', (done) => {
        delete doc.userId;
        shouldNotComplain(doc, done);
    });

    it('Should not complain if location is not provided', (done) => {
        delete doc.location;
        shouldNotComplain(doc, done);
    });

    it('Should not complain when timezone is not provided', (done) => {
        delete doc.timezone;
        shouldNotComplain(doc, done);
    });
});
