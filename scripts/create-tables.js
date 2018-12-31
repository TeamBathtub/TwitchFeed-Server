require('dotenv').config();
const client = require('../lib/db-client');

client.query(`

  CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    username VARCHAR(256) NOT NULL UNIQUE, -- enforce unique at a db level
    first_name VARCHAR(256),
    email VARCHAR(256),
    hash VARCHAR(256) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS favorite (
    id SERIAL PRIMARY KEY,
    streamer_name VARCHAR(256) NOT NULL,
    profile_id INTEGER NOT NULL REFERENCES profile(id)
  );
    
  -- why is profile_id not included?
  CREATE TABLE IF NOT EXISTS rating (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profile(id),
    streamer_name VARCHAR(256) NOT NULL,
    score INTEGER NOT NULL
  );
`)
  .then(
    () => console.log('create tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });