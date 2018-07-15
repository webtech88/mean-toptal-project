import express              from 'express';
import cors                 from 'cors';
import path                 from 'path';
import morgan               from 'morgan';
import bodyParser           from 'body-parser';
import {errorHandler}       from './module-middlewares';
import restIdentity         from './rest-identity';
import restUsers            from './rest-users';
import restTimezones        from './rest-timezones';


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

restIdentity(app);
restUsers(app);
restTimezones(app);

app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

app.use(errorHandler);

export default app;
