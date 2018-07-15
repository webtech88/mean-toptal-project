import {Schema} from 'mongoose';
import {emailRegex, transform} from './utils';

const userStatuses = ['active', 'inactive'];
const userTypes = ['user', 'manager', 'admin'];

const userDefinition = {
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        match: emailRegex
    },

    password: {
        type: String
    },

    photo: {
        type: String
    },

    wrongCount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        required: true,
        enum: userStatuses,
        default: 'inactive'
    },

    type: {
        type: String,
        required: true,
        enum: userTypes,
        default: 'user'
    },

    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },

    facebook: {
        userId: String,
        accessToken: String
    },

    google: {
        userId: String,
        accessToken: String
    }
};

const userSchema = new Schema(userDefinition);

if(!userSchema.options.toObject)
    userSchema.options.toObject = {};

userSchema.options.toObject.transform = transform;

export {userSchema, userStatuses, userTypes};