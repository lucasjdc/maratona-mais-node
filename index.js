require('dotenv').config();
const https = require('https');

// Pega o nome do filme digitado no terminal
const args = process.argv.slice(2);
const nomeFilme = args.join('+'); // Junta palavras com "+" para a URL

if (!nomeFilme) {
    console.log('Digite o nome de um filme. Ex: node index.js Top Gun');
    process.exit(1);
}

const apikey = process.env.OMDB_API_KEY;

const url  = `https://www.omdbapi.com/?t=${nomeFilme}&apikey=${apikey}`;

https.get(url, (res) => {
    let data = '';

    // Receba os dados em partes
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Quando terminar de receber
    res.on('end', () => {
        const filme = JSON.parse(data);
        if (filme.Response === 'True') {
            console.log(`Título: ${filme.Title}`);
            console.log(`Ano: ${filme.Year}`);
            console.log(`Gênero: ${filme.Genre}`);
            console.log(`Atores: ${filme.Actors}`);
            filme.Ratings.forEach(rating => {
                console.log(` - ${rating.Source}: ${rating.Value}`);
            });
        } else {
            console.log(`Filme não encontrado: ${filme.Error}`)
        }
    });
}).on('error', (err) => {
    console.error('Erro:', err.message);
});
