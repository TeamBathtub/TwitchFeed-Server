require('dotenv').config();
const client = require('../lib/db-client');
const bcrypt = require('bcryptjs');

const profiles = [
  { username: 'kristinhortsch', 
    firstName: 'kristin', 
    email: 'kristinhortsch@gmail.com', 
    hash: bcrypt.hashSync('abc', 8)
  },
  { 
    username: 'averagemarcy', 
    firstName: 'marcy', 
    email: 'marcysilverman@gmail.com', 
    hash: bcrypt.hashSync('abc', 8)
  },
  { 
    username: 'tylercorbett', 
    firstName: 'tyler', 
    email: 'tylercorbett@gmail.com', 
    hash: bcrypt.hashSync('abc', 8)
  }
];

Promise.all(
  profiles.map(profile => {
    return client.query(`
    INSERT INTO profile (username, first_name, email, hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
   `,
    [profile.username, profile.firstName, profile.email, profile.hash]);
  })
)
  .then(
    () => console.log('seed data load complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });