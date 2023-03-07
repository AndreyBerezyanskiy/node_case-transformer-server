const http = require('http');

const { convertToCase } = require('./convertToCase');
const { checkForErrors } = require('./utils/checkForErrors');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

    const textToReplace = normalizedURL.pathname.slice(1);
    const caseToConvert = normalizedURL.searchParams.get('toCase');

    const errors = checkForErrors(textToReplace, caseToConvert);
    const hasError = errors.length > 0;

    if (hasError) {
      res.end(JSON.stringify({
        errors,
      }));

      res.statusCode = 400;
    } else {
      const result = convertToCase(textToReplace, caseToConvert);

      res.end(JSON.stringify({
        originalCase: result.originalCase,
        targetCase: caseToConvert,
        originalText: textToReplace,
        convertedText: result.convertedText,
      }));

      res.statusCode = 200;
    }
  });

  return server;
}

module.exports = { createServer };
