/**
 * Zero-dependency static & download file server for TruthLens AI
 * Run with: node serve.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Dedicated download endpoint for ZIP
  if (urlPath === '/download-zip' || urlPath === '/download') {
    const zipPath = path.join(ROOT, 'TruthLens-AI.zip');
    if (!fs.existsSync(zipPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('ZIP file not found');
      return;
    }
    const stat = fs.statSync(zipPath);
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="TruthLens-AI.zip"',
      'Content-Length': stat.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(zipPath).pipe(res);
    return;
  }

  // Normalize URL path for static assets
  let safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // If requesting zip, force download attachment
    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    };

    if (ext === '.zip') {
      headers['Content-Disposition'] = `attachment; filename="${path.basename(filePath)}"`;
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`TruthLens AI server active at: http://localhost:${PORT}`);
  console.log(`Direct ZIP Download: http://localhost:${PORT}/download-zip`);
});
