const http = require('http');
const https = require('https');
const uriParser = require('url');
const crypto = require('crypto');



exports.sendHttpRequest = function (url, method = 'get', rawBody, headers = {}) {

  const urlParts = uriParser.parse(url);
  const client = urlParts.protocol === 'https:' ? https : http;
  let port = urlParts.port;
  if (!port) {
    port = urlParts.protocol === 'https:' ? 443 : 80;
  }

  const options = {
    hostname: urlParts.hostname,
    port,
    path: urlParts.path,
    method: method.toUpperCase(),
    headers: {Accept: '*/*', 'User-Agent': `NodeHttpLib/${process.version}`}
  };

  if (headers) {
    for (let h in headers) {
      options.headers[h] = headers[h];
    }
  }

  return new Promise((resolve, reject) => {
    let responseBody = '';
    const req = client.request(options, function (res) {
      console.log('STATUS:', res.statusCode);
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        responseBody += chunk;
      });

      res.on('end', function () {
        console.log('Request Completed');
        resolve({
          statusCode: res.statusCode,
          data: responseBody,
          headers: res.headers
        });
      });
    });

    req.on('error', function (e) {
      console.log('Problem with request:', e.message);
      e.data = responseBody;
      reject(e);
    });

    if (rawBody) {
      req.write(rawBody);
    }
    req.end();
  });
};

exports.sha1Hex = (data) => crypto.createHash('sha1').update(data).digest('hex');
exports.sha256Hex = (data) => crypto.createHash('sha256').update(data).digest('hex');