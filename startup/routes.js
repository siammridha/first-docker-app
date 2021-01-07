const cors = require('cors')
const helmet = require("helmet")
const morgan = require("morgan")
const express = require('express')
const bodyParser = require('body-parser')
const error = require('../middleware/error')
const createMessage = require('../routes/message/create-message')
const { serverSentEvents } = require("../routes/server-sent-events")

module.exports = function (app) {
    app.use(cors())
    app.use(helmet())
    app.use(express.json())
    app.use(bodyParser.json())
    app.use(morgan('dev'))
    app.use('/message', createMessage)
    app.use('/stream', serverSentEvents)
    app.get('/', (req, res) => {
        res.set('Content-Type', 'application/json');
        return res.status(200).send(Buffer.from(JSON.stringify(process.env, null, 2)).toString('utf-8'));
    })
    app.use(error);
}