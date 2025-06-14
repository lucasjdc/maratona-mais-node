async function buscarFilme() {
    const titulo = document.getElementById('titulo').value;
    const resposta = document.getElementById('resultado');
    const imgPoster = document.getElementById('poster');

    const resp = await fetch('http://localhost:3000/filme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo })
    });

    const dados = await resp.json();

    if (resp.ok) {
        resposta.innerHTML = `
            <h2>${dados.titulo}</h2>
            <p><strong>Ano:</strong> ${dados.ano}</p>
        `;
        if (dados.poster) {
            imgPoster.src = dados.poster;
            imgPoster.style.display = 'block';
        } else {
            imgPoster.style.display = 'none';
        }
    } else {
        resposta.innerHTML = `<p style="color: red;">Erro: ${dados.erro}</p>`;
        imgPoster.style.display = 'none';
    }
}

