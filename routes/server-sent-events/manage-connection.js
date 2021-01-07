const uuid = require('uuid').v4;
const Redis = require("ioredis");
const hostname = require('os').hostname();
const config = { port: "6379", host: "redis" }

module.exports = function () {
    const clients = {};
    const pub = new Redis(config);
    const sub = new Redis(config);

    this.addClient = (client) => {
        client = { id: uuid(), hostname, ...client }
        clients[client.id] = client;
        return client;
    }

    this.removeClient = (client) => {
        delete clients[client.id];
    }

    this.emit = (action, data, host) => {
        if (!host) pub.publish("chat", JSON.stringify({ action, data, hostname }));
        Object.values(clients).forEach((client) => {
            if (client && 'status' in client) {
                client.status(200).write(`data: ${JSON.stringify({ action, data })}\n\n`)
            }
        });
    }

    sub.subscribe("chat", (error, count) => {
        if (error) throw error
        console.log("count:", count);
    });

    sub.on("message", (channel, message) => {
        message = JSON.parse(message)
        if (message.hostname !== hostname) {
            console.log("receive a message %s from channel %s", message.hostname, channel);
            this.emit(message.action, message.data, message.hostname)
        }
    });
};
