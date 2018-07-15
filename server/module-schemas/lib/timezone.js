import {Schema} from 'mongoose';
import {transform} from './utils';

const timezoneDefinition = {
    name: {
        type: String
    },

    city: {
        type: String
    },

    updateDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    location: {
        lat: String,
        lng: String
    },

    timezone: {
        type: String
    }
};

const timezoneSchema = new Schema(timezoneDefinition);

if(!timezoneSchema.options.toObject)
    timezoneSchema.options.toObject = {};

timezoneSchema.options.toObject.transform = transform;

export {timezoneSchema};