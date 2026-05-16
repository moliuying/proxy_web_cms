"use strict";
var crypto = require('crypto');
const passwordToMd5 = function (pwd) {
    var salt = "sandygogoing";
    return crypto.createHash('md5').update(pwd).update(salt).digest('hex');
};

console.log(passwordToMd5('Aiziji99'))
