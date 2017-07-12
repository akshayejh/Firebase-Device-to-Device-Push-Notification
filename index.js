'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendNotification = functions.database.ref('/notifications/{user_id}/{notification_id}').onWrite(event => {

  const user_id = event.params.user_id;
  const notification = event.params.notification;

  console.log('We have a notification to send to : ', user_id);

  if(!event.data.val()){

    return console.log('A Notification has been deleted from the database : ', notification_id);

  }

  const deviceToken = admin.database().ref(`/Users/${user_id}/device_token`).once('value');

  return deviceToken.then(result => {

    const token_id = result.val();

    const payload = {
      notification: {
        title : "Friend Request",
        body: "You've received a new Friend Request",
        icon: "default"
      }
    };

    return admin.messaging().sendToDevice(token_id, payload).then(response => {

      console.log('This was the notification Feature');

    });


  });


});
