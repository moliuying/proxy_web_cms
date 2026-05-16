const crypto = require('crypto')


export const passwordToMd5 = (pwd)=> {
    let salt = "sandygogoing"
    return crypto.createHash('md5').update(pwd).update(salt).digest('hex')
}
