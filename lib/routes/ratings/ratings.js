/*eslint-disable-next-line*/
const router = require('express').Router();
const client = require('../../db-client');

router.post('/', (req, res) => {
  const body = req.body;

  client.query(`
        INSERT into rating (
            user_name,
            score
        )
        VALUES ($1, $2)
        RETURNING
            id,
            user_name as "userName",
            score;
    `,
  [body.userName, body.score]
  )
    .then(result => {
      res.json(result.rows[0]);
    });
});

router.get('/stats', (req, res) => {
  client.query(`
    SELECT
        user_name,
        CAST(AVG(score) as int) as average
    FROM rating
    GROUP BY user_name
    ORDER BY average DESC;
    `)
    .then(result => {
      res.json(result.rows);
    });
});

module.exports = router;