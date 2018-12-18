require('dotenv').config();
const pg = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

const Client = pg.Client;

const client = new Client(DATABASE_URL);

client.connect()
  .then(() => console.log('connected to db', DATABASE_URL))
  .catch(err => console.error('connection error', err));

client.on('error', err => {
  console.error('\n**** DATABASE ERROR ****\n\n', err);
});

module.exports = client;