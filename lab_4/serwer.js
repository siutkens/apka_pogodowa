const http = require("http")
const fs = require("fs")
const path = require("path")

PORT = 3000

const routes = {
    "/": "index.html",
    "/about": "about.html",
    "/contact": "contact.html"
}

const server = http.createServer((req, res) => {
    const fileName = routes[req.url]

    if (!fileName) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        res.end("<h1>404 Nie znaleziono strony</h1>");
        return;
    }

    const filePath = path.join(__dirname, fileName)

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" })
            res.end("<h1>500 Błąd Serwera</h1>");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Server działa: http://localhost:${PORT}`)
});