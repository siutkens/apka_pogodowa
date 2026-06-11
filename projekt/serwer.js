const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MIME_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml"
};

const serwer = http.createServer((req, res) => {
    const requestPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const filePath = path.normalize(path.join(ROOT, requestPath));

    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end("Brak dostępu");
        return;
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(error.code === "ENOENT" ? 404 : 500, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            res.end(error.code === "ENOENT" ? "Nie znaleziono pliku" : "Błąd serwera");
            return;
        }

        const contentType = MIME_TYPES[path.extname(filePath)] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
});

serwer.listen(PORT, () => {
    console.log(`Strona działa: http://localhost:${PORT}`);
});
