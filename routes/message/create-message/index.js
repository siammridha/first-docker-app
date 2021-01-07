const router = require('express').Router()
const { emit } = require("../../server-sent-events");

module.exports = router.post('/', async (req, res) => {
    const contentType = (!req.headers || !req.headers['content-type'] || req.headers['content-type'] !== 'application/json');
    if (contentType) return res.status(500).send({ message: "content-type must be application/json" });

    if (!req.body.message) return res.status(500).send({ message: "Message is required" })
    if (req.body.message.trim().length === 0) return res.status(500).send({ message: "Message cannot be empty." })

    const data = req.body.message.trim();

    emit("NEW-MESSAGE", data);

    return res.sendStatus(200);
})