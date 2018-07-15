import db from './db';
import {userSchema, userStatuses, userTypes} from './user';
import {timezoneSchema} from './timezone';

const user = {
    schema: userSchema,
    statuses: userStatuses,
    types: userTypes,
    User: db.model('User', userSchema, 'users')
};

const timezone = {
    schema: timezoneSchema,
    Timezone: db.model('Timezone', timezoneSchema, 'timezones')
};

export {
    db,
    user,
    timezone
};