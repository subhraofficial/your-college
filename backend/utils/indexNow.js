const https = require('https');

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL = 'https://yourcollege.in';

function submitToIndexNow(urls) {
  if (!INDEXNOW_KEY || !Array.isArray(urls) || urls.length === 0) {
    return;
  }

  const body = JSON.stringify({
    host: 'yourcollege.in',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  });

  const options = {
    hostname: 'api.indexnow.org',
    path: '/IndexNow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const request = https.request(options, (response) => {
    console.log(`IndexNow response: ${response.statusCode}`);

    response.on('data', () => {});
  });

  request.on('error', (error) => {
    console.error('IndexNow error:', error.message);
  });

  request.write(body);
  request.end();
}

module.exports = {
  submitToIndexNow,
};