require('dotenv').config();
const https = require('https');

function buscarFilme(titulo) {
    return new Promise((resolve, reject) => {
        const apikey = process.env.OMDB_API_KEY;
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${apikey}`;

        https.get(url, omdbRes => {
            let data = '';
            omdbRes.on('data', chunk => { data += chunk; });
            omdbRes.on('end', () => {
                try {
                    const filme = JSON.parse(data);
                    //console.log(filme);
                    if (filme.Response === 'True') {
                        resolve({
                            titulo: filme.Title,
                            ano: filme.Year,
                            genero: filme.Genre,
                            atores: filme.Actors,
                            poster: filme.Poster,
                            avaliacoes: filme.Ratings
                        });
                    } else {
                        reject( { status: 404, erro: filme.Error });
                    }
                } catch (e) {
                    reject({ status: 500, erro: 'Erro ao interpretar resposta da OMDb' });
                }
            });
        }).on('error', err => {
            reject({ status: 500, erro: 'Erro na requisição à OMDb', detalhe: err.message });
        });
    });
}

module.exports = { buscarFilme };