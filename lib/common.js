const cookie = require('cookie');

exports.authIsOwner = function(request, response) {
    var isOwner = false;

    var cookies = {};
    if (request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }

    if(cookies.email === 'yongki' && cookies.password === '1111') {
        isOwner = true;
    }

    return isOwner;
}

exports.authIsOwnerNotGoPage = function(request, response) {
    let authIsOwnerFlag = this.authIsOwner(request, response);

    if(!authIsOwnerFlag) {
        response.send('Login required!!');
    }

    return authIsOwnerFlag;
}