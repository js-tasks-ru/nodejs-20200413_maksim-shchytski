const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    return res.end();
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      fs.access(filepath, (error) => {
        if (error) {
          res.statusCode = 404;
          return res.end();
        }

        fs.unlink(filepath, (error) => {
          if (error) {
            console.error(error);
            return;
          }

          res.statusCode = 200;
          res.end();
        });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
