const http = require('http');
const filmeHandler = require('./handlers/filmeHandler');

const PORT = 3000;

const server = http.createServer(filmeHandler);

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

