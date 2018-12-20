require('dotenv').config();
const client = require('../lib/db-client');
const bcrypt = require('bcryptjs');

const favorites = [
  { user_name: 'ninja', profile_id: 1 },
  { user_name: 'shroud', profile_id: 1 },
  { user_name: 'ZeRo', profile_id: 2 },
  { user_name: 'mistermv', profile_id: 2 },
  { user_name: 'shroud', profile_id: 2 },
  { user_name: 'kevin', profile_id: 2 },
  { user_name: 'jukes', profile_id: 2 },
  { user_name: 'sodapoppin', profile_id: 2 },
  { user_name: 'robi', profile_id: 2 },
  { user_name: 'mang0', profile_id: 2 },
  { user_name: 'hexy', profile_id: 2 },
  { user_name: 'Gorgc', profile_id: 1 },
  { user_name: 'Rakin', profile_id: 1 },
  { user_name: 'timthetatman', profile_id: 1 },
  { user_name: 'sodapoppin', profile_id: 1 },
  { user_name: 'DrDisrespect', profile_id: 1 },
  { user_name: 'littlesiha', profile_id: 1 },
  { user_name: 'zeRo', profile_id: 1 },
  { user_name: 'cloakzy', profile_id: 1 },
  { user_name: 'DisguisedToast', profile_id: 1 },
  { user_name: 'Yogscast', profile_id: 1 },
  { user_name: 'Stray228', profile_id: 1 },
  { user_name: 'Yassuo', profile_id: 2 },
  { user_name: 'zilula2', profile_id: 2 },
  { user_name: 'timthetatman', profile_id: 3 },
  { user_name: 'sodapoppin', profile_id: 2 },
  { user_name: 'DrDisrespect', profile_id: 3 },
  { user_name: 'zeRo', profile_id: 2 },
  { user_name: 'cloakzy', profile_id: 3 },
  { user_name: 'DisguisedToast', profile_id: 2 },
  { user_name: 'Yogscast', profile_id: 3 },
  { user_name: 'Stray228', profile_id: 2 },
  { user_name: 'zilula2', profile_id: 3 }
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
const ratings = [
  {
    user_name: 'Ninja', 
    score: 5
  },
  {
    user_name: 'TimThetatman', 
    score: 3
  },
  {
    user_name: 'shroud', 
    score: 4
  },
  {
    user_name: 'LIRIK', 
    score: 4
  },
  {
    user_name: 'Yogscast', 
    score: 3
  },
  {
    user_name: 'dakotaz', 
    score: 1
  },
  {
    user_name: 'Tfue', 
    score: 5
  },
  {
    user_name: 'dakotaz', 
    score: 1
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
    () => {
      return Promise.all(
        ratings.map(rating => {
          return client.query(`
            INSERT INTO rating (user_name, score)
            VALUES ($1, $2);
          `,
          [rating.user_name, rating.score])
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