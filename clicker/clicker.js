let botaoMenuEl = document.querySelector('#menu');//aq eu crio variaveis e definos elas como um elemento do html 
let bodyEl = document.querySelector('body');

let expandido = true;//crio/defino uma varial como verdadeira

botaoMenuEl.addEventListener('click', (e) => {//espera o evento de click no #menu
    let nomeMusicaEl = document.querySelectorAll('.musiquinha h2');//pega o h2 das playlists salvas e coloca em uma lista
    if (expandido === true) {//se ja estiver expandido...
        bodyEl.style.gridTemplateColumns = '5vw auto';
        nomeMusicaEl.forEach(el => {//pega a lista e executa os comandos abaixo p tds os h2s dessa lista
            el.style.display = 'none';//"esconde" os elementos h2
            if(el.previousElementSibling) el.previousElementSibling.style.display = 'none';//esconde o elemento anterior do h2(h1)
        });
    } else {
        bodyEl.style.gridTemplateColumns = '15vw auto';
        nomeMusicaEl.forEach(el => {
            el.style.display = 'block';//abre h2
            if(el.previousElementSibling) el.previousElementSibling.style.display = 'block';//abre anterior do h2(h1)
        });
    }
    expandido = !expandido;//inverte o valor de expandido
    console.log(expandido);
});


let playlists = [
    {
        nome: "Minhas Buscas",
        musicas: []
    }
];

let filaMusicas = [];
let indiceMusicaAtual = 0;
let audioPlayer = new Audio();

function addMusicasNoHtml () {
    let playlistsContainer = document.querySelector('#playlists');
    playlistsContainer.innerHTML = ''; 

    playlists.forEach(playlist => {
        let musicasDiv = document.createElement('div');

        let listaMusicasHtml = playlist.musicas.length > 0 
            ? playlist.musicas.map((m, index) => `
                <div class="item-musica" onclick="tocarMusicaDaPlaylist('${playlist.nome}', ${index})" style="cursor: pointer; margin-bottom: 6px;">
                    <h2>🎵 ${m.nome} - ${m.artista}</h2>
                </div>
              `).join('')
            : `<h2>Nenhuma música ainda</h2>`;

        let capaImg = playlist.musicas.length > 0 && playlist.musicas[0].capa 
            ? playlist.musicas[0].capa 
            : "https://www.kindpng.com/picc/m/26-260950_vector-royalty-free-download-cd-drawing-aesthetic-png.png";

        musicasDiv.innerHTML = `
        <img src="${capaImg}" alt="">
            <div>
                <h1>${playlist.nome}</h1>
                ${listaMusicasHtml}
            </div>`;
        musicasDiv.classList.add('musiquinha');
        playlistsContainer.appendChild(musicasDiv);
    });
}

async function buscarMusicaApi(termoBusca, nomePlaylistDestino) {
    try {
        let callbackNome = 'receberMusicas';

        window[callbackNome] = function(dados) {
            let playlistObj = playlists.find(p => p.nome === nomePlaylistDestino);

            if (playlistObj && dados.results) {
                playlistObj.musicas = [];

                dados.results.forEach(musicaEncontrada => {
                    playlistObj.musicas.push({
                        nome: musicaEncontrada.trackName,
                        artista: musicaEncontrada.artistName,
                        capa: musicaEncontrada.artworkUrl100,
                        preview: musicaEncontrada.previewUrl
                    });
                });

                addMusicasNoHtml();

                if (playlistObj.musicas.length > 0) {
                    tocarMusicaDaPlaylist(nomePlaylistDestino, 0);
                } else {
                    alert('Nenhuma música encontrada!');
                }
            }

            delete window[callbackNome];
            script.remove();
        };

        let script = document.createElement('script');

        script.src = `https://itunes.apple.com/search?term=${encodeURIComponent(termoBusca)}&media=music&entity=song&limit=10&callback=${callbackNome}`;

        script.onerror = function() {
            delete window[callbackNome];
            script.remove();
            alert('Erro ao conectar com a API!');
        };

        document.body.appendChild(script);

    } catch (erro) {
        console.error("Erro ao buscar música:", erro);
        alert("Não foi possível buscar as músicas. Tente novamente.");
    }
}

function tocarMusicaDaPlaylist(nomePlaylist, index) {
    let playlistObj = playlists.find(p => p.nome === nomePlaylist);

    if (playlistObj && playlistObj.musicas[index]) {
        filaMusicas = playlistObj.musicas;
        indiceMusicaAtual = index;

        let musica = filaMusicas[indiceMusicaAtual];

        if (musica.preview) {
            audioPlayer.src = musica.preview;

            audioPlayer.play().then(() => {
                atualizarFooterPlayer(musica);
            }).catch(erro => {
                console.error("Erro ao reproduzir música:", erro);
            });
        } else {
            alert("Essa música não possui prévia disponível.");
        }
    }
}

function atualizarFooterPlayer(musica) {
    let footerEl = document.querySelector('footer');

    footerEl.innerHTML = `
        <div class="player-info">
            <img src="${musica.capa}" alt="Capa">
            <div>
                <strong>${musica.nome}</strong>
                <span>${musica.artista}</span>
            </div>
        </div>
        <div class="player-controls">
            <button onclick="musicaAnterior()">⏮</button>
            <button id="btn-play-pause" onclick="togglePlayPause()">⏸</button>
            <button onclick="proximaMusica()">⏭</button>
        </div>
    `;
}

function togglePlayPause() {
    let btn = document.querySelector('#btn-play-pause');

    if (audioPlayer.paused) {
        audioPlayer.play();
        if(btn) btn.innerText = "⏸";
    } else {
        audioPlayer.pause();
        if(btn) btn.innerText = "▶";
    }
}

function proximaMusica() {
    if (filaMusicas.length > 0) {
        let proximoIndice = (indiceMusicaAtual + 1) % filaMusicas.length;

        if (filaMusicas[proximoIndice].preview) {
            indiceMusicaAtual = proximoIndice;
            let musica = filaMusicas[indiceMusicaAtual];

            audioPlayer.src = musica.preview;
            audioPlayer.play();
            atualizarFooterPlayer(musica);
        }
    }
}

function musicaAnterior() {
    if (filaMusicas.length > 0) {
        let indiceAnterior = (indiceMusicaAtual - 1 + filaMusicas.length) % filaMusicas.length;

        if (filaMusicas[indiceAnterior].preview) {
            indiceMusicaAtual = indiceAnterior;
            let musica = filaMusicas[indiceMusicaAtual];

            audioPlayer.src = musica.preview;
            audioPlayer.play();
            atualizarFooterPlayer(musica);
        }
    }
}

audioPlayer.addEventListener('ended', () => {
    proximaMusica();
});

// Pesquisa real ao apertar Enter
let barraPesquisa = document.querySelector('#barra-pesquisa');

barraPesquisa.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let termo = barraPesquisa.value.trim();

        if (termo !== '') {
            playlists[0].nome = `Busca: ${termo}`;
            buscarMusicaApi(termo, playlists[0].nome);
            barraPesquisa.value = '';
        }
    }
});

addMusicasNoHtml();
