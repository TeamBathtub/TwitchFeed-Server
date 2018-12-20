/*eslint-disable-next-line*/
const router = require('express').Router(); 
const client = require('../../db-client');


router.get('/', (req, res) => {
  console.log('hi');
  client.query(`
    SELECT 
      user_name as "userName"
    FROM favorite
    WHERE profile_id = $1;
  `,
  [req.userId])
    .then(result => {
      console.log('banana\n\n', req.userId);

      res.json(result.rows);
    });
});
router.get('/:id', (req, res) => {
  client.query(`
  SELECT 
  user_name
  FROM favorite
  WHERE id = $1;
  `,
  [req.params.id])
    .then(result => {
      res.json(result.rows[0]);
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
      user_name,
      profile_id as "profileId";
  `,
  [body.user_name, req.userId]
  )
    .then(result => {
      res.json(result.rows[0]);
    });
});
router.delete('/:name', (req, res) => {
  client.query(`
  DELETE FROM favorite 
  WHERE user_name = $1;
  `,
  [req.params.name])
    .then(result => {
      res.json({ removed: result.rowCount === 1 });
    });
});



module.exports = router;