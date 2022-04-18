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
    console.log(resposta); //lembrar de tirar
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
    console.log(mensagens);
    for(let i = 0; i < qntMensagens; i++){
        if(mensagens[i].type === "status"){
            chat.innerHTML += `<div class="status">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
        }
        if(mensagens[i].type === "message"){
            if(mensagens[i].to === "Todos"){
                chat.innerHTML += `<div class="msgTodos">
                                <span class="time">(${mensagens[i].time})</span>
                                <span class="user">${mensagens[i].from}</span>
                                <span class="text">para</span>
                                <span class="user">${mensagens[i].to}<span class="text">:</span></span>
                                <span class="text">${mensagens[i].text}</span>
                            </div>`
            } else {
                chat.innerHTML += `<div class="msgReservada">
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