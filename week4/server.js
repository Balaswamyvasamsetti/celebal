const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const dir = path.join(__dirname, 'files');

if (!fs.existsSync(dir)) fs.mkdirSync(dir);

app.use((request, response, next) => {
  console.log(`Got ${request.method} ${request.url}`);
  next();
});

app.get('/', (request, response) => {
  response.send(`
    <html>
    <head><title>File Manager</title><style>body { font-family: Arial; margin: 20px; text-align: center; } a { color: blue; }</style></head>
    <body>
      <h1>File Manager</h1>
      <p><a href="/create?file=test.txt&data=hi">Create file</a></p>
      <p><a href="/read?file=test.txt">Read file</a></p>
      <p><a href="/delete?file=test.txt">Delete file</a></p>
      <p><a href="/about">About</a></p>
    </body>
    </html>
  `);
});

app.get('/about', (request, response) => {
  response.send(`
    <html>
    <head><title>About</title><style>body { font-family: Arial; margin: 20px; text-align: center; } a { color: blue; }</style></head>
    <body>
      <h1>About</h1>
      <p>Express.js file management server.</p>
      <p><a href="/">Home</a></p>
    </body>
    </html>
  `);
});

app.get('/create', (request, response) => {
  const file = request.query.file;
  const data = request.query.data || '';
  if (!file) return response.send('<h1>Error</h1><p>File name needed</p><a href="/">Home</a>');
  fs.writeFile(path.join(dir, file), data, (err) => {
    if (err) return response.send('<h1>Error</h1><p>Could not create file</p><a href="/">Home</a>');
    response.send('<h1>Success</h1><p>File created</p><a href="/">Home</a>');
  });
});

app.get('/read', (request, response) => {
  const file = request.query.file;
  if (!file) return response.send('<h1>Error</h1><p>File name needed</p><a href="/">Home</a>');
  fs.readFile(path.join(dir, file), 'utf8', (err, content) => {
    if (err) return response.send('<h1>Error</h1><p>File not found</p><a href="/">Home</a>');
    response.send(`<html><head><title>Read</title><style>body { font-family: Arial; margin: 20px; text-align: center; } a { color: blue; }</style></head><body><h1>File: ${file}</h1><p>${content}</p><a href="/">Home</a></body></html>`);
  });
});

app.get('/delete', (request, response) => {
  const file = request.query.file;
  if (!file) return response.send('<h1>Error</h1><p>File name needed</p><a href="/">Home</a>');
  fs.unlink(path.join(dir, file), (err) => {
    if (err) return response.send('<h1>Error</h1><p>File not found</p><a href="/">Home</a>');
    response.send('<h1>Success</h1><p>File deleted</p><a href="/">Home</a>');
  });
});

app.use((request, response) => {
  response.status(404).send(`
    <html>
    <head><title>404</title><style>body { font-family: Arial; margin: 20px; text-align: center; } a { color: blue; }</style></head>
    <body>
      <h1>404 Not Found</h1>
      <p>Try <a href="/">Home</a> or <a href="/about">About</a>.</p>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});