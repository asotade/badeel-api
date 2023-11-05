const mongoose = require('mongoose');

const {
  MONGO_HOSTNAME, MONGO_PORT, MONGO_DATABASE, MONGO_USERNAME, MONGO_PASSWORD,
} = process.env;

// mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]

const dbURI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DATABASE}`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
