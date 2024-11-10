// src/models/gameModel.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'game';

const createGame = async (game) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: game.id,
      city_map_id: game.city_map_id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`Game with ID ${game.id} created successfully.`);
  } catch (err) {
    console.error('Error creating game:', err);
    throw new Error('Could not create game.');
  }
};

const getGameById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      throw new Error('Game not found');
    }
    return data.Item;
  } catch (err) {
    console.error('Error getting game:', err);
    throw new Error('Could not retrieve game.');
  }
};

const updateGame = async (id, updateData) => {
  const updateParams = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET #city_map_id = :city_map_id, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#city_map_id': 'city_map_id',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':city_map_id': updateData.city_map_id,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDB.update(updateParams).promise();
    console.log('Game updated successfully:', result);
    return result.Attributes;
  } catch (err) {
    console.error('Error updating game:', err);
    throw new Error('Could not update game.');
  }
};

module.exports = { createGame, getGameById, updateGame };
