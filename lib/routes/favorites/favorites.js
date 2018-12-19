/*eslint-disable-next-line*/
const router = require('express').Router(); 
const client = require('../../db-client');


router.get('/', (req, res) => {
  client.query(`
    SELECT 
      user_name
    FROM favorite
    WHERE profile_id = $1;
  `,
  [req.userId])
    .then(result => {
      console.log('banana\n\n', req.userId);

      res.json(result.rows);
    });
});

router.post('/', (req, res) => {
  const body = req.body;

  client.query(`
    INSERT into favorite (
      user_name, 
      profile_id 
    )
    VALUES ($1, $2)
    RETURNING 
      id, 
      user_name as "userName"
      profile_id;
  `,
  [body.userName, req.userId]
  )
    .then(result => {
      res.json(result.rows[0]);
    });
});

module.exports = router;