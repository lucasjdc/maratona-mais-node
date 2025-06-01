const { buscarFilme } = require('../services/omdbService');
const { handleCors } = require('../utils/cors');

function filmeHandler(req, res) {
    handleCors(req, res);
    if (res.writableEnded) return;

    if (req.method === 'POST' && req.url === '/filme') {
        let body = '';

        req.on('data', chunk => { body += chunk.toString(); });

        req.on('end', async () => {
            try {
                const { titulo } = JSON.parse(body);
                if (!titulo) {
                    res.writeHead(400, { 'Contnt-Type': 'application/json' });
                    return res.end(JSON.stringify({ erro: 'Campo "titulo" é obrigatório' }));
                }

                console.log(`Buscando filme: ${titulo}`);
                const resultado = await buscarFilme(titulo);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(resultado, null, 2));
            } catch (e) {
                console.log('Erro ao processar JSON:', e.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ erro: 'JSON inválido' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }
}

module.exports = filmeHandler;