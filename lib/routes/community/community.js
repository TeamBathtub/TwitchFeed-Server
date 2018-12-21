const router = require('express').Router(); 
const client = require('../../db-client');

router.get('/', (req, res) => {
  client.query(`
    SELECT user_name
    FROM favorite
    WHERE profile_id != $1
  `,
  [req.userId]
  )
    .then(result => {
      res.json(result.rows);
    });
});

module.exports = router;