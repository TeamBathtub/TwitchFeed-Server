const router = require('express').Router();
const request = require('superagent');

router.get('/', (req, res) => {
  request.get('https://api.twitch.tv/helix/streams')
    .set('Content-Type', 'application/json')
    .set('Client-ID', '8sb2kt99biht5q3k79k7hsejyj0q2y')
    .then(response => {
      console.log('response', response.body);
      const twitchResults = response.body.data.map(stream => {
        return {
          user_name: stream.user_name,
          viewer_count: stream.viewer_count
        };
      });
      res.json(twitchResults);
    });
});

module.exports = router;