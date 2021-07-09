require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.post('/token', async (req, res) => {
  if (!req.body.identity || !req.body.room) {
    return res.status(400);
  }

  // Get the user's identity from the request
  const identity  = req.body.identity;

  // Create a video grant
  const videoGrant = new VideoGrant({
    room: req.body.room
  })

  // Create an access token
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
  );

  // Add the video grant and the user's identity to the token
  token.addGrant(videoGrant);
  token.identity = identity;

  // Serialize the token to a JWT and return it to the client side
  res.send({
    token: token.toJwt()
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});