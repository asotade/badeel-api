require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

require('./db');

const app = express();
const port = process.env.PORT || 4000;
const prefix = process.env.PREFIX || '/api/v1';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const modRoutes = require('./routes');

Object.entries(modRoutes)
  .forEach(([suffix, handlers]) => {
    console.log(`${suffix} handlers loaded!`);
    app.use(prefix + suffix, handlers);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
