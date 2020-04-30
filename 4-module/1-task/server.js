const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const nestedPathName = pathname.split('/');
      if (nestedPathName.length > 1) {
        res.statusCode = 400;
        return res.end();
      }

      const result = fs.readFile(filepath, (error, data) => {
        if (error || !data) {
          res.statusCode = 404;
          return res.end();
        }
        if (data) {
          res.end(data);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
