import createTimezone     		from './src/handlers/create-timezone';
import deleteTimezone           from './src/handlers/delete-timezone';
import getTimezone              from './src/handlers/get-timezone';
import updateTimezone           from './src/handlers/update-timezone';
import getTimezones             from './src/handlers/get-timezones';
import getUserTimezones         from './src/handlers/get-user-timezones'

export default function (app) {
    app.use(createTimezone);              //POST    /v1/timezone
    app.use(deleteTimezone);              //DELETE  /v1/timezone/:id
    app.use(getTimezone);                 //GET     /v1/timezone/:id
    app.use(updateTimezone);              //PUT     /v1/timezone/:id
    app.use(getTimezones);                //GET     /v1/timezones/all
    app.use(getUserTimezones);            //GET     /v1/timezones
}