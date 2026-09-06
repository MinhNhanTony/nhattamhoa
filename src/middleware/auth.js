const jwt = require('jsonwebtoken')


function handleRequireToken (req, res, next,key) {
    const {token} = req.params;

    jwt.verify(token,key , function(err, decoded) {

        if(decoded?.data) {
            next();
        }
        else {
            res.json({err:"Token invalid"})
        }
    })
}

async function requireToken(req, res, next) {
    const key = process.env.SECRET_KEY;
    handleRequireToken(req, res, next,key)
}
async function requireAdminToken(req, res, next) {
    const key = process.env.AUTH_SECRET_KEY;

    handleRequireToken(req, res, next,key)
  
}

module.exports = {requireToken,requireAdminToken};
