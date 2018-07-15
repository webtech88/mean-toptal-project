import getUsers     		from './src/handlers/get-users';
import getUser     			from './src/handlers/get-user';
import getProfile			from './src/handlers/get-profile';
import updateUser   		from './src/handlers/update-user';
import updateUserStatus 	from './src/handlers/update-user-status';
import deleteUser			from './src/handlers/delete-user';
import createUser			from './src/handlers/create-user';
import resetUserPassword	from './src/handlers/reset-user-password';
import updateUserProfile	from './src/handlers/update-user-profile';
import uploadUserPhoto		from './src/handlers/upload-photo';

export default function (app) {
	app.use(getUsers);              //GET /v1/users
	app.use(getUser);               //GET /v1/user/:userId
	app.use(getProfile);            //GET /v1/users/profile
	app.use(updateUser);            //PUT /v1/user/:userId
	app.use(updateUserStatus);      //PUT /v1/users/restore
	app.use(deleteUser);			//DEL /v1/user/:userId
	app.use(createUser);			//POST /v1/user/new
	app.use(resetUserPassword);     //PUT /v1/users/password/:userId
	app.use(updateUserProfile);     //PUT /v1/users/profile
	app.use(uploadUserPhoto);       //POST /v1/users/photo
}