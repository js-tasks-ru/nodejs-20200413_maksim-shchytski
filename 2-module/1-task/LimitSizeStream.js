const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #length = 0;
  #limit;
  constructor(options) {
    super(options);
    const { limit } = options;
    this.#limit = limit;
  }

  _transform(chunk, encoding, callback) {
    this.#length += chunk.length;
    if (this.#length <= this.#limit) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
