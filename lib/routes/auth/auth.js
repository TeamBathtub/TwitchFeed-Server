/*eslint-disable-next-line*/
const router = require('express').Router(); 
const client = require('../../db-client');
const bcrypt = require('bcryptjs');
const jwt = require('../../jwt');


function getProfileWithToken(profile) {
  return {
    id: profile.id,
    username: profile.username,
    token: jwt.sign({ id: profile.id })
  };
}

router.post('/signup', (req, res) => {

  const body = req.body;
  const username = body.username;
  const password = body.password;
  
  if(!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }

  client.query(`
    SELECT id
    FROM profile
    WHERE username = $1;
  `,
  [username])  
    .then(result => {
      if(result.rows.length > 0) {
        res.status(400).json({ error: 'username already exists' });
        return;
      }

      console.log('creating new user profile...');

      client.query(`
        INSERT into profile (
          username, 
          first_name, 
          email,
          hash
        )
        VALUES ($1, $2, $3, $4)
        RETURNING username, first_name as "firstName", email, hash;
      `,
      [username, body.firstName, body.email, bcrypt.hashSync(password, 8)]
      )
        .then(result => {
          const profile = result.rows[0];
          res.json(getProfileWithToken(profile));
        });
    });
});
  
router.post('/signin', (req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;

  if(!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }

  client.query(`
    SELECT id, username, hash
    FROM profile
    WHERE username = $1;
  `,
  [username]
  )
    .then(result => {
      const profile = result.rows[0];

      if(!profile || !bcrypt.compareSync(password, profile.hash)) {
        res.status(400).json({ error: 'username or password incorrect' });
        return;
      }
      res.json(getProfileWithToken(profile));
    });
});

module.exports = router;