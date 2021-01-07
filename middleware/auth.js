const fs = require('fs');
const jwt = require('jsonwebtoken');
const { issuer } = require('config');
const debug = require("debug")("app:auth");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization || req.query.authorization
    if (token) {
      try {
        const bearerToken = token.includes("Bearer")? token.split('Bearer ')[1] : token
        const publicKey = fs.readFileSync('middleware/public.key', 'utf8')
        const verifyOptions = { issuer, algorithms: ["RS256"] }
        req.jwt_claims = jwt.verify(bearerToken, publicKey, verifyOptions)
            return next()
        } catch (error) {
            debug(error)
            return res.status(401).send({ message: 'Invalid access token.' })
        }
    } else {
        debug('token not found.')
        return res.status(401).send({ message: 'Unauthorized.' })
    }
}