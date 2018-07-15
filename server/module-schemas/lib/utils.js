const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

function transform(doc, ret, options) {
    ret = JSON.parse(JSON.stringify(ret));
    delete ret.__v;
    return ret;
}

export {emailRegex, transform};