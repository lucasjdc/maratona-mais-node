require('dotenv').config();
const https = require('https');

function filmeHandler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    console.log(`Requisição recebida: ${req.method} ${req.url}`);


    if (req.method === 'POST' && req.url === '/filme') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log(`Corpo recebido: ${body}`);
            try {
                const { titulo } = JSON.parse(body);
                if (!titulo) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ erro: 'Campo "titulo" é obrigatório' }));
                }

                const apikey = process.env.OMDB_API_KEY;
                const url = `https://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${apikey}`;

                console.log(`Buscando filme: ${titulo}`);                

                https.get(url, (omdbRes) => {
                    let data = '';

                    omdbRes.on('data', chunk => {
                        data += chunk;
                    });

                    omdbRes.on('end', () => {
                        console.log(`Resposta da OMDb: ${data}`);
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
                    console.log('Erro na requisição à OMDb', err.message);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ erro: 'Erro na requisição à OMDb', detalhe: err.message }));
                });
            } catch (e) {
                console.log('Erro ao processar JSON:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ erro: 'JSON inválido' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }
}

module.exports = filmeHandler;
