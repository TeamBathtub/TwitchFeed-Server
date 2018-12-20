const router = require('express').Router(); 
const client = require('../../db-client');

router.get('/', (req, res) => {
  const body = req.body;
  client.query(`
    SELECT 
      user_name as "userName"
    FROM favorite;
  `,
  [body.user_name]
  )
    .then(result => {
      res.json(result.rows[0]);
    });
});

module.exports = router;