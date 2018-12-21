require('dotenv').config();
const client = require('../lib/db-client');
const favorites = require('./seed-data/favorites-seed-data');
const profiles = require('./seed-data/profiles-seed-data');
const ratings = require('./seed-data/ratings-seed-data');

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
