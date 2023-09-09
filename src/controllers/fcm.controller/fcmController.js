const admin = require('firebase-admin');
const catchAsync = require('../../utils/catchAsync');

const sendNotification = catchAsync(async (req, res) => {
  const message = {
    token: 'dURtxOPjTDCu99GXLLXHz4:APA91bH7skBurMKmoJdclQlMlvB9svc2cOpYgatxeKXYi91qvbj4ag-s1ePaN-pbLFPfqeVI4puk5d09O5BjQkYTwcSwQ-DTcu0KihaQoOQDae7zkItZ_GZZtponvgR8YIxliI7mvcAk',
    notification: {
      // 
      title: 'Hey Apoorv, How ya doing?',
      body: 'This is the body of the notification',
    },
    data: {
      customKey: 'customValue',
    },
  };

  const response = await admin.messaging().send(message);
  return res.status(200).json({ success: true, response });
});

module.exports = {
  sendNotification,
};
