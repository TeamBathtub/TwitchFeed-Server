/*eslint-disable-next-line*/
const router = require('express').Router();
const client = require('../db-client');

const RETURNING = `RETURNING
  id,
  user_name as "userName",
  profile_id as "profileId"
  score
`;

function insertRating(streamer, score, userId) {
  return client.query(`
    INSERT into rating (
      user_name,
      score,
      profile_id
    )
    VALUES ($1, $2, $3)
    ${RETURNING};
    `,
  [streamer, score, userId]
  );
}

function updateRating(streamer, score, userId) {
  return client.query(`
    UPDATE rating 
    SET score = $1
    WHERE user_name = $2
    AND profile_id = $3
    ${RETURNING};
    `,
  [score, streamer, userId]
  );
}

router.post('/', (req, res) => {
  const body = req.body;

  // You would also need to make sure user only had
  // one rating per streamer. Unlike favorites,
  // you would need to do an UPDATE if already exists.
  // (There is also a more advanced INSERT "ON CONFLICT" where you can do this in one go!)
  client.query(`
    SELECT id
    FROM rating
    WHERE user_name = $1
    AND profile_id = $2;
  `, [])  
    .then(result => {
      const sql = result.rows.length > 0 ? updateRating : insertRating;
      return sql(body.userName, body.score, req.userId);
    })
    .then(result => {
      res.json(result.rows[0]);
    });
})

  .get('/stats', (req, res) => {
    client.query(`
      SELECT
        user_name,
        ROUND(AVG(score)::numeric,2) as average
      FROM rating
      GROUP BY user_name
      ORDER BY average DESC;
    `)
      .then(result => {
        res.json(result.rows);
      });
  });

module.exports = router;