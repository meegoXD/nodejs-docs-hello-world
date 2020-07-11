const express = require('express')
const bodyParser = require('body-parser')

const app = express().use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('POST: webhook')

    const body = req.body;

    if(body.object === 'page') {

        body.entry.forEach(entry => {

            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        });

        res.status(200).send('Evento recibido')
    } else {
        res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {
    console.log('GET: webhook')

    const verificar_token = 'StringMiTokenUnico';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if ( mode && token ) {
        if ( mode === 'subscribe' && token === verificar_token ) {
            console.log('Webhook verificado');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Hola a mi bot');
});

app.listen(8080, () => {
    console.log('Inicio e servidor...');
})

//const port = process.env.PORT || 1337;
//server.listen(port);

//console.log("Server running at http://localhost:%d", port);
