let botaoMenuEl = document.querySelector('#menu');//aq eu crio variaveis e definos elas como um elemento do html 
let bodyEl = document.querySelector('body');

let expandido = true;//crio/defino uma varial como verdadeira

botaoMenuEl.addEventListener('click', (e) => {//espera o evento de click no #menu
    nomeMusicaEl = document.querySelectorAll('.musiquinha h2');//pega o h2 das playlists salvas e coloca em uma lista
    if (expandido === true) {//se ja estiver expandido...
        bodyEl.style.gridTemplateColumns = '5vw auto';
        nomeMusicaEl.forEach(el => {//pega a lista e executa os comandos abaixo p tds os h2s dessa lista
            el.style.display = 'none';//"esconde" os elementos h2
            el.previousElementSibling.style.display = 'none';//esconde o elemento anterior do h2(h1)
        });
    } else {
        bodyEl.style.gridTemplateColumns = '15vw auto';
        nomeMusicaEl.forEach(el => {
            el.style.display = 'block';//abre h2
            el.previousElementSibling.style.display = 'block';//abre anterior do h2(h1)
        });
    }
    expandido = !expandido;//inverte o valor de expandido
    console.log(expandido);
});

let playlists = []