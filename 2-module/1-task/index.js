const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const limitedStream = new LimitSizeStream({ limit: 8 }); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.on('error', (error) => {
  console.log(error);
});

limitedStream.pipe(outStream);

limitedStream.write('hello');

limitedStream.write('world');
