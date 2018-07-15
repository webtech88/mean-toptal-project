import {waterfall}      from 'async';
import {get}            from '../module-config';
import {db, user, timezone}       from '../module-schemas';
import {generateUser, generateTimezone}   from '../module-testhelpers';
import {issueToken}     from '../module-jwt';

const {User} = user;
const {Timezone} = timezone;

before(function(done) {
    this.timeout(20000);

    const tasks = [
        function (cb) {
            process.env.ENV = 'test';
            const mongodbUri = get('mongodb_test_uri');

            db.open(mongodbUri, cb);
        },
        function (cb) {
            let doc = generateUser();

            User.create(doc, function(err, result){
                if(err) return cb(err);
                global.user = result.toObject();
                cb();
            });
        },
        function (cb) {
            let doc = generateTimezone();

            Timezone.create(doc, function(err, result){
                if(err) return cb(err);
                global.timezone = result.toObject();
                cb();
            });
        },
        function (cb) {
            const {_id, type} = global.user;
            issueToken({_id, type}, function (err, token) {
                if(err) return cb(err);
                global.authToken = token;
                cb();
            });
        }
    ];

    waterfall(tasks, function (err) {
        if(err) console.log(err);
        done();
    });
});

after(function(done) {
    if(!global.user) return done();
    User.findByIdAndRemove(global.user._id, done);

    if(!global.timezone) return done();
    Timezone.collection.drop();
    // Timezone.findByIdAndRemove(global.timezone._id, done);
});