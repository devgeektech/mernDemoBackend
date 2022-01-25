import { DevicesModel } from "../models";
var admin = require('firebase-admin');
import { ObjectID } from 'mongodb';

var serviceAccount = require("../../wyred-78e47-firebase-adminsdk-1i9rh-1d4bfe21e8.json");
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const sendNotification = async (userId,title,body,customData) => {
  const devices = await DevicesModel.aggregate([
    {
      $match: {userId:ObjectID(userId),status:true},
    }
  ])
   console.log(customData,'customData');    
   console.log(devices,'devices-------------------------------------->>>>');
   if(devices && devices.length > 0){
    let deviceTokens = []; 
     for(let i in devices){
      const registrationTokens = [devices[i].deviceToken];
      const message = {
        data: customData,
        tokens: registrationTokens,
        notification: {
            title: title,
            body: body
          },
      };
      await app.messaging().sendMulticast(message)
        .then((response) => {
          console.log(response,'response');
          console.log(response.successCount + ' messages were sent successfully');
      });
    }
  }
}

