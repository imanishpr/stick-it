// src/models/userModel.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'userInfo';

const createUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId: user.userId,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      role: user.role || 'user',
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`User ${user.username} created successfully.`);
  } catch (err) {
    console.error('Error creating user:', err);
    throw new Error('Could not create user.');
  }
};

const getUserById = async (userId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      throw new Error('User not found');
    }
    return data.Item;
  } catch (err) {
    console.error('Error getting user:', err);
    throw new Error('Could not retrieve user.');
  }
};

const updateUser = async (userId, updateData) => {
  const updateParams = {
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: 'SET #username = :username, #email = :email, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#username': 'username',
      '#email': 'email',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':username': updateData.username,
      ':email': updateData.email,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDB.update(updateParams).promise();
    console.log('User updated successfully:', result);
    return result.Attributes;
  } catch (err) {
    console.error('Error updating user:', err);
    throw new Error('Could not update user.');
  }
};

module.exports = { createUser, getUserById, updateUser };
