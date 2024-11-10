const loginService = require('../services/loginService');

exports.getData = async (req, res) => {
  try {
    const data = await loginService.getData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data' });
  }
};