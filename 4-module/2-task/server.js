const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    return res.end();
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      receiveFile(filepath, req, res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function receiveFile(filepath, req, res) {
  const writeStream = fs.createWriteStream(filepath, { flags: 'wx' });
  const limitStream = new LimitSizeStream({ limit: 1e6 });

  req.pipe(limitStream).pipe(writeStream);

  limitStream.on('error', (error) => {
    if (error.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.end(error.message);

      fs.unlink(filepath, () => {});
      return;
    }

    res.statusCode = 500;
    res.end('Internal server error');

    fs.unlink(filepath, () => {});
  });

  writeStream
    .on('error', (error) => {
      if (error.code === 'EEXIST') {
        res.statusCode = 409;
        return res.end(error.message);
      }

      res.statusCode = 500;
      res.end('Internal server error');
      fs.unlink(filepath, () => {});
    })
    .on('close', () => {
      res.statusCode = 201;
      res.end('File created');
    });

  res.on('close', () => {
    if (res.finished) return;
    fs.unlink(filepath, () => {});
  });
}

module.exports = server;
