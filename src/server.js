require('dotenv').config();
const app = require('./app');
const { connectMongo, initPostgresTables } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongo();
    await initPostgresTables();

    app.listen(PORT, () => {
      console.log(`
    🎮 GameVault API is running
    📍 Server:  http://localhost:${PORT}
    📚 Docs:    http://localhost:${PORT}/api-docs
    🌍 Env:     ${process.env.NODE_ENV || 'development'}
      `);
    });
  } catch (err) {
    console.error('❌ Erreur au démarrage:', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

startServer();