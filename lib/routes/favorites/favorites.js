/*eslint-disable-next-line*/
const router = require('express').Router(); 
const client = require('../../db-client');


router.get('/', (req, res) => {
  client.query(`
    SELECT
      id, 
      user_name as "userName"
    FROM favorite
    WHERE profile_id = $1;
  `,
  [req.userId])
    .then(result => {
      res.json(result.rows);
    });
});
router.post('/', (req, res) => {
  const body = req.body;

  
  client.query(`
    SELECT profile_id
    FROM favorite
    WHERE user_name = $1;
  `,
  [body.user_name])  
    .then(result => {
      if(result.rows.length > 0) {
        res.status(400).json({ error: 'username already exists' });
        return;
      }

      client.query(`
    INSERT INTO favorite (
      user_name, 
      profile_id
    ) 
    VALUES ($1, $2)
    RETURNING
      id,
      user_name,
      profile_id;
`,

      [body.user_name, req.userId])
        .then(result => {
          res.json(result.rows[0]);
        });
    });
});

router.delete('/:userId', (req, res) => {
  client.query(`
  DELETE FROM favorite WHERE profile_id = $1;
  `,
  [req.params.userId])
    .then(result => {
      res.json({ removed:result.rowCount === 1 });
    });
});



module.exports = router;