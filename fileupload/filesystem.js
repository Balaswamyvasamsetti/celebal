const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const DIR = path.join(__dirname, 'files');

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

function send(res, code, msg, type = 'text/plain') {
  res.writeHead(code, { 'Content-Type': type });
  res.end(msg);
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  const file = query.file;
  const data = query.data || '';
  const filePath = file ? path.join(DIR, file) : null;

  if (pathname === '/') {
    send(res, 200, `
      <h2>Simple file management tool </h2>
      <ul>
        <li><a href="/create?file=sample.txt&data=Hello Welcome to Celebel Internship 2nd Week Task">Create file</a></li>
        <li><a href="/read?file=sample.txt">Read file</a></li>
        <li><a href="/delete?file=sample.txt">Delete file</a></li>
      </ul>
    `, 'text/html');
  } else if (pathname === '/create') {
    if (!file) return send(res, 400, 'File name needed');
    fs.writeFile(filePath, data, (err) => {
      if (err) return send(res, 500, 'Cannot create file');
      send(res, 200, 'File created');
    });
  } else if (pathname === '/read') {
    if (!file) return send(res, 400, 'File name needed');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) return send(res, 404, 'File not found');
      send(res, 200, content);
    });
  } else if (pathname === '/delete') {
    if (!file) return send(res, 400, 'File name needed');
    fs.unlink(filePath, (err) => {
      if (err) return send(res, 404, 'File not found');
      send(res, 200, 'File deleted');
    });
  } else {
    send(res, 404, 'Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});