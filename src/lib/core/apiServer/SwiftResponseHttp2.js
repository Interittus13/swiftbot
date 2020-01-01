const { Http2ServerResponse } = require('http2');

class SwiftResponseHttp2 extends Http2ServerResponse {
  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    return this.end(JSON.stringify(data));
  }
}

module.exports = SwiftResponseHttp2;
