// require('dotenv').config(); 
// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// const client = twilio(accountSid, authToken);

// async function sendSms(toPhone, message) {
//    try {
//       const response = await client.messages.create({
//          body: message,
//          from: twilioPhone, 
//          to: toPhone, 
//       });
//       console.log(" SMS sent successfully!", response.sid);
//    } catch (error) {
//       console.error("Error sending SMS:", error.message);
//    }
// }

// module.exports = sendSms;
