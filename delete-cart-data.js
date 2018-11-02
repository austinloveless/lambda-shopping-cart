require("dotenv").config();
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: process.env.REGION,
  apiVersion: "2012-08-10"
});

exports.handler = (event, context, callback) => {
  const params = {
    Key: {
      UserId: {
        S: event.userId
      }
    },
    TableName: process.env.TABLENAME
  };
  dynamodb.deleteItem(params, (err, data) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);
      callback(null, data);
    }
  });
};
