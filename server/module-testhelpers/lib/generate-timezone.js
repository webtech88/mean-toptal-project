import Chance from 'chance';

const random = new Chance();

export default function () {
    return {
        name: random.name(),
        city: random.city(),
        updateDate: random.date(),
        userId: global.user._id,
        location: {lat: random.latitude().toString(), lng: random.longitude().toString()},
        timezone: random.areacode()
    };
}