require('dotenv').config();
const http = require('http');
const https = require('https');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/filme') {
        let body = '';

        // Correção: deve ser req.on, não res.on
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { titulo } = JSON.parse(body);
                if (!titulo) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ erro: 'Campo "titulo" é obrigatório' }));
                }

                const apikey = process.env.OMDB_API_KEY;
                const url = `https://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${apikey}`;

                https.get(url, (omdbRes) => {
                    let data = '';

                    omdbRes.on('data', chunk => {
                        data += chunk;
                    });

                    omdbRes.on('end', () => {
                        const filme = JSON.parse(data);

                        if (filme.Response === 'True') {
                            const resposta = {
                                titulo: filme.Title,
                                ano: filme.Year,
                                genero: filme.Genre,
                                atores: filme.Actors,
                                avaliacoes: filme.Ratings
                            };

                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(resposta, null, 2));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ erro: filme.Error }));
                        }
                    });
                }).on('error', err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ erro: 'Erro na requisição à OMDb', detalhe: err.message }));
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ erro: 'JSON inválido' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
