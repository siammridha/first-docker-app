const router = require('express').Router();
const Connections = require("./manage-connection");
const connections = new Connections();

router.get('/', (req, res) => {
    res.set('Connection', 'keep-alive');
    res.set('Cache-Control', 'no-cache');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'text/event-stream');

    const client = connections.addClient({
        write: res.write.bind(res),
        status: res.status.bind(res),
    });

    res.socket.on('end', () => {
        connections.removeClient(client);
        console.log(`Disconnected: [${client.id}] [${client.hostname}]`);
        return res.end();
    });

    console.log(`Connected: [${client.id}] [${client.hostname}]`);
});

exports.emit = connections.emit;
exports.serverSentEvents = router;