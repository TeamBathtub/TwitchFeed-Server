require('dotenv').config();
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

module.exports = profiles;