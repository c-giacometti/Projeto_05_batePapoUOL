let nome = prompt("Qual o seu nome?");
const chat = document.querySelector(".chat");

entrada();

function entrada(){
    let dados = {name: nome};
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
}

function tratarSucesso(resposta){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(carregarChat);
}

function tratarErro(erro){
    if(erro.response.status === 400){
        prompt("Esse nome já está em uso. Por favor, escolha outro nome:");
        entrada();
    }
}

function carregarChat(resposta){
    const mensagens = resposta.data;
    const qntMensagens = mensagens.length;
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
            } else {
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
    }
    const todasAsMensagens = document.querySelectorAll('.mensagem')
    const elementoQueQueroQueApareca = todasAsMensagens[todasAsMensagens.length-1];
    elementoQueQueroQueApareca.scrollIntoView();
}