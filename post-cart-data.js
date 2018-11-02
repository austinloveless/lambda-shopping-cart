require("dotenv").config();
exports.handler = (event, context, callback) => {
  const params = {
    Item: {
      UserId: {
        S: event.UserId
      },
      CartItem: {
        S: event.CartItem
      }
    },
    TableName: process.env.TABLENAME
  };
  dynamodb.putItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);
      callback(null, data);
    }
  });
};
