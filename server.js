const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const httpsOptions = {
  pfx: fs.readFileSync(process.env.SPRING_SSL_KEY_STORE_FILE),
  passphrase: process.env.SPRING_SSL_KEY_STORE_PASSWORD,
};

https.createServer(httpsOptions, app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS frontend running on port ${PORT}`);
});