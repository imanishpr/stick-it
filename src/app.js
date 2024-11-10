const express = require('express');
const app = express();

app.use(express.json());
const loginRoute = require('./routes/loginRoute');
app.use('/api/v1/user-info', loginRoute);

module.exports = app;