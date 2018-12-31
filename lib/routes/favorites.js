/*eslint-disable-next-line*/
const router = require('express').Router(); 
const client = require('../db-client');

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
})

  .post('/', (req, res) => {
    const body = req.body;

    client.query(`
      SELECT 
        id, 
        profile_id as "profileId",
        user_name as "streamer" -- assuming you made this changegetRandomScore()
      FROM favorite
      WHERE user_name = $1;
  `,
    [body.user_name])  
      .then(result => {
        if(result.rows.length > 0) {
          // Doesn't need to be error, objective is already satisfied:
          // res.status(400).json({ error: 'streamer already favorited' });

          // so just send back the data:
          res.json(result.rows[0]);
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
            user_name as "userName",
            profile_id as "profileId";
`,
        [body.user_name, req.userId])
          .then(result => {
            res.json(result.rows[0]);
          });
      });
  })

  // oh no! this would delete all rows with that stream name!
  .delete('/:name', (req, res) => {
    client.query(`
      DELETE FROM favorite 
      WHERE user_name = $1
      AND profile_id = $2; -- needs to be this user!
  `,
    [req.params.name, req.userId])
      .then(result => {
        console.log('DELETE FINISH');
        res.json({ removed: result.rowCount === 1 });
      });
  });

module.exports = router;