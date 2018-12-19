require('dotenv').config();
const client = require('../lib/db-client');
const bcrypt = require('bcryptjs');

const favorites = [
  { userName: 'ninja', profileId: 1 },
  { userName: 'shroud', profileId: 1 },
  { userName: 'ZeRo', profileId: 2 },
  { userName: 'mistermv', profileId: 2 },
  { userName: 'shroud', profileId: 2 },
  { userName: 'kevin', profileId: 2 },
  { userName: 'jukes', profileId: 2 },
  { userName: 'summit1g', profileId: 2 },
  { userName: 'sodapoppin', profileId: 2 },
  { userName: 'robi', profileId: 2 },
  { userName: 'mang0', profileId: 2 },
  { userName: 'hexy', profileId: 2 },
  { userName: 'tyler1', profileId: 1 },
  { userName: 'zilula2', profileId: 1 },
  { userName: 'zilula2', profileId: 2 },
  { userName: 'zilula2', profileId: 3 }
];
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
    [profile.username, profile.firstName, profile.email, profile.hash])
      .then(result => result.rows[0]);
  })
)
  .then(() => {
    return Promise.all(
      favorites.map(favorite => {
        return client.query(`
          INSERT INTO favorite (user_name, profile_id)
          VALUES ($1, $2);             
        `,
        [favorite.user_name, favorite.profile_id])
          .then(result => result.rows[0]);
      })
    );
  })
  .then(
    () => console.log('seed data load complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });