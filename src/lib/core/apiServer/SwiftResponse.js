const { ServerResponse } = require('http');

class SwiftResponse extends ServerResponse {
  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    return this.end(JSON.stringify(data));
  }
}

module.exports = SwiftResponse;
