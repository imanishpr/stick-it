const app = require('./app');
const initDb = require('./config/initDb');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Initialize database tables
  await initDb();

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
