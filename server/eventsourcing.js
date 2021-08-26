const express = require('express');
const cors = require('cors');
const events = require('events');

const PORT = 5000;

const eventEmitter = new events.EventEmitter();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/connect', (req, res) => {
    res.writeHead(200,{
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    });
    eventEmitter.on('newMessage', (message) => {
        res.write(`data: ${JSON.stringify(message)} \n\n`);
    });
});

app.post('/new-message', (req, res) => {
    const message = req.body;
    eventEmitter.emit('newMessage', message);
    res.status(200);
});

app.listen(PORT, () => console.log(`Server started on ${PORT} port...`));
