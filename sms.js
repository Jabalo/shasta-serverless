const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const fs = require('fs');
const contents = fs.readFileSync('famlist.json');
const famJson = JSON.parse(contents);

const send = (excludeNumber, petName) => {
    const client = require('twilio')(accountSid, authToken);
    const famList = famJson.famList;
    let message = 'Feed us!\nCosmo 🐕, reply \'C\'.\nArchie 🐈, reply \'A\'.\nLuna 🐆, reply \'L\'';

    if (excludeNumber && petName) {
        const excludeName = famList.find(member => member.phoneNumber === excludeNumber).name;
        message = petName + 'has been fed by ' + excludeName;
    }

    return famList.map(member => {
        if (member.phoneNumber !== excludeNumber) {
            const sms = {
                to: member.phoneNumber,
                body: message,
                from: process.env.PHONE_NUMBER
            }

            return client.messages
                .create(sms)
                .then(message => console.log(message.sid));                  
        }
    });
}

module.exports.handler = async (event, context) => {
    // const message = await send(event.excludeNumber, event.petName);
    console.log(event);
    
    const famList = famJson.famList;

    const excludeName = famList.find(member => {
        console.log('member', member.phoneNumber);
        console.log('event', event.excludeNumber);
        return member.phoneNumber === event.excludeNumber
    }).name;
}