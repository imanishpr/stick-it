// src/config/initDb.js
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const dynamoDB = new AWS.DynamoDB();

const createTableIfNotExists = async (tableName, params) => {
  try {
    await dynamoDB.describeTable({ TableName: tableName }).promise();
    console.log(`Table "${tableName}" already exists.`);
  } catch (err) {
    if (err.code === 'ResourceNotFoundException') {
      await dynamoDB.createTable(params).promise();
      console.log(`Table "${tableName}" created successfully.`);
    } else {
      console.error(`Error checking existence of table "${tableName}":`, err);
    }
  }
};

const initDb = async () => {
  const userInfoParams = {
    TableName: 'userInfo',
    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  };

  const gameParams = {
    TableName: 'game',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  };

  await createTableIfNotExists('userInfo', userInfoParams);
  await createTableIfNotExists('game', gameParams);
};

module.exports = initDb;
