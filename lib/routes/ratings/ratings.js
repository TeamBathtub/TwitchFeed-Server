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
            user_name
            score;
    `,
  [body.user_name, body.score]
  )
    .then(result => {
      res.json(result.rows[0]);
    });
});

module.exports = router;