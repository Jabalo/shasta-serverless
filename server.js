const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const aws = require('aws-sdk');

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const lambda = new aws.Lambda({
    region: 'us-east-1',
});

// Server
module.exports = app;

// Client
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { personList: friendsList.getAll() });
});

app.post('/submit', (req, res) => {
    friendsList.add(req.body.friendName);

    res.render('person-added', { personName: req.body.friendName, personList: friendsList.getAll() });
})

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    const message = req.body.Body;
    const senderPhoneNumber = req.body.From;

    switch (message) {
        case 'C':
            return Promise.all([
                twiml.message('Thanks for feeding Cosmo!'),
                sendNotificationToOthers(senderPhoneNumber)
            ]);
    }

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

const sendNotificationToOthers = (senderPhoneNumber) => {
    
    console.log(senderPhoneNumber);

    const params = {
        FunctionName: 'shasta-dev-sms',
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ sender: senderPhoneNumber })
    };

    return lambda.invoke(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    }); 
}