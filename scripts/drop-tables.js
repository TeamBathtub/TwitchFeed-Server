require('dotenv').config();
const client = require('../lib/db-client');

client.query(`
  DROP TABLE IF EXISTS favorite;
  DROP TABLE IF EXISTS profile;
  DROP TABLE IF EXISTS rating;
`)
  .then(
    () => console.log('drop tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });