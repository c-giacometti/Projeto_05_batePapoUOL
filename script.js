//declaração de variáveis globais
let nome = prompt("Qual o seu nome?");
let sucesso = 0;

//chama a primeira função
entrada();

//manda o nome para API
function entrada(){
    let dados = {name: nome};
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
}

//caso o nome não seja repetido, carrega o chat
function tratarSucesso(resposta){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(carregarChat);
    sucesso++;
    intervalos(); //chama as funções setInterval
}

//caso o nome seja repetido, pede para que entre outro
function tratarErro(erro){
    nome = prompt("Esse nome já está em uso. Por favor, escolha outro nome:");
    entrada();
}

//chama funções para atualizar chat e atualizar presença
function intervalos(){
    if(sucesso == 1){
        const pararChat = setInterval(tratarSucesso, 3000);
        const pararOnline = setInterval(atualizarOnline, 5000);
    }
}

//atualiza presença
function atualizarOnline(){
    const dados = {name: nome};
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dados);
} 

//carrega chat
function carregarChat(resposta){
    const chat = document.querySelector(".chat");
    const mensagens = resposta.data;
    const qntMensagens = mensagens.length;
    chat.innerHTML = "";
    for(let i = 0; i < qntMensagens; i++){
        if(mensagens[i].type === "status"){
            chat.innerHTML += `<div class="mensagem status">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
        }
        if(mensagens[i].type === "message"){
            if(mensagens[i].to === "Todos"){
                chat.innerHTML += `<div class="mensagem msgTodos">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">para</span>
                                <span class="user">${mensagens[i].to}<span class="text">:</span></span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
            }
        }
        if(mensagens[i].type === "private_message"){
            if(mensagens[i].to === nome){
                chat.innerHTML += `<div class="mensagem msgReservada">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">reservadamente para</span>
                                <span class="user">${mensagens[i].to}<span class="text">:</span></span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
            }
        }
    }
    //scrolla até o fim do chat
    const todasAsMensagens = document.querySelectorAll('.mensagem');
    const elementoQueQueroQueApareca = todasAsMensagens[todasAsMensagens.length-1];
    elementoQueQueroQueApareca.scrollIntoView();
}

//envia mensagem para o servidor após o click no icon
function enviarMensagem(click){
    const input = click.parentNode.querySelector("input");
    const mensagem = input.value;
    const dados = {
        from: nome,
	    to: "Todos",
	    text: mensagem,
	    type: "message"
    };
    input.value = "";
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dados);
    requisicao.then(tratarSucesso);
    requisicao.catch(reload);
}

//caso haja erro no envio da mensagem, recarrega a pagina
function reload(){
    window.location.reload();
}