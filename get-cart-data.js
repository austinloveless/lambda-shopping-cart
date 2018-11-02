require("dotenv").config();
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: process.env.REGION,
  apiVersion: "2012-08-10"
});
const cisp = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});

exports.handler = (event, context, callback) => {
  const accessToken = event.accessToken;

  const type = event.type;
  if (type == "all") {
    const params = {
      TableName: process.env.TABLENAME
    };
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        console.log(data);
        const items = data.Items.map(dataField => {
          return {
            cartitem: dataField.CartItem.S
          };
        });
        callback(null, items);
      }
    });
  } else if (type == "single") {
    const cispParams = {
      AccessToken: accessToken
    };
    cisp.getUser(cispParams, (err, result) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        console.log(result);
        const userId = result.UserAttributes[0].Value;
        const params = {
          Key: {
            UserId: {
              S: userId
            }
          },
          TableName: process.env.TABLENAME
        };
        dynamodb.getItem(params, (err, data) => {
          if (err) {
            console.log(err);
            callback(err);
          } else {
            console.log(data);
            callback(null, [
              {
                cartitem: data.Item.CartItem.S
              }
            ]);
          }
        });
      }
    });
  } else {
    callback("something went wrong");
  }
};
