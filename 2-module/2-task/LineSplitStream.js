const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #lastChunk;
  #encoding;
  constructor(options) {
    super(options);
    const { encoding } = options;
    this.#encoding = encoding;
    this.#lastChunk = '';
  }

  _transform(chunk, encoding, callback) {
    const chunks = (this.#lastChunk + chunk.toString()).split(os.EOL);
    const lastChunk = chunks.pop();

    for (const part of chunks) {
      this.push(part, this.#encoding);
    }
    if (lastChunk.includes(os.EOL)) {
      this.push(this.#lastChunk);
    } else {
      this.#lastChunk = lastChunk;
    }

    callback();
  }

  _flush(callback) {
    if (this.#lastChunk) {
      this.push(this.#lastChunk, this.#encoding);
    }
    callback();
  }
}

module.exports = LineSplitStream;
