const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express().use(bodyParser.json());

const FACEBOOK_TOKEN = process.env.FACEBOOK_TOKEN;

app.post('/webhook', (req, res) => {
    console.log('POST: webhook')

    const body = req.body;

    if(body.object === 'page') {

        body.entry.forEach(entry => {

            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);

            const sender_psid = webhookEvent.sender.id;
            console.log(`Sender PSID: ${sender_psid}`);

            if (webhookEvent.message) {
                handleMessage(sender_psid, webhookEvent.message)
            } else if (webhookEvent.postback) {
                handlePostback(sender_psid, webhookEvent.postback)
            }
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

function handleMessage(sender_psid, received_message) {
    let response;

    if (received_message.text) {
        response = {
            'text' : `Tu mensaje fue: ${received_message.text} 🙊`
        }
    }

    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {

}

function callSendAPI(sender_psid, response) {
    const requestBody = {
        'recipient' : {
            'id' : sender_psid
        },
        'message' : response
    };

    request({
        'uri' : 'https://graph.facebook.com/v2.6/me/messages',
        'qs' : {'access_token': FACEBOOK_TOKEN},
        'method': 'POST',
        'json' : requestBody
    }, (err, res, body) => {
        if (!err) {
            console.log('Mensaje enviado de vuelta');
        } else {
            console.error('imposible enviar el texto 😢');
        }
    });

}

app.listen(process.env.PORT, () => {
    console.log('Inicio e servidor...');
})