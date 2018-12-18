const express = require('express');
const app = express();
const morgan = require('morgan');
const auth = require('./routes/auth/auth');
const twitch = require('./routes/twitch/twitch'); 
const jwt = require('./jwt');

// enhanced logging
app.use(morgan('dev'));

// register the json "middleware" body parser
app.use(express.json());

app.use(express.static('public'));

//don't forget to put checkAuth//
function checkAuth(req, res, next) {
  const token = req.get('Authorization');
  console.log('token\n\n', token); 
  if(!token) {
    res.status(401).json({ error: 'no authorization found' });
    return;
  }

  let payload = null;
  try {
    payload = jwt.verify(token); 

  }
  catch (err) {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  req.userId = payload.id;
  next(); 
}

app.use('/api/auth', auth);
app.use('/api/twitch', checkAuth, twitch);

module.exports = app;
