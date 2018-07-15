import { createServer } from 'http';
import app from './app';
import {get} from './module-config';
import {db} from './module-schemas';
import {hash} from './module-crypto';
import {waterfall} from 'async';
import {user} from './module-schemas';

const {User} = user;

const tasks = [
    (cb) => {
        const mongodbUri = get('mongodb_uri');

        db.open(mongodbUri, cb);
    },

    (cb) => {
        const server = createServer(app),
            port = get('port');

        server.listen(port, () => {
            console.log('Server is running at : ' + port);
            cb(null, server);
        });
    },

    // if no admin, create new admin accout
    (cb) => {
        User.find({type: 'admin'}).count().then((count) => {
            if (count <= 0) {
                const payload = {
                    firstName: 'Admin',
                    lastName: 'admin',
                    email: 'admin@piao.com',
                    password: hash('123456789'),
                    status: 'active',
                    type: 'admin'
                };
                User.create(payload, (err, result) => {
                    if(err) return next(err);
                    console.log('Created new admin account.');
                });
            }
        })
    }
];

function bootstrap() {
    waterfall(tasks, (err) => {
        if(err) console.log(err);
    });
}

export default bootstrap;
