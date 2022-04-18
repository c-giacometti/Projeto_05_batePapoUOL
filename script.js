let nome = prompt("Qual o seu nome?");

entrada();

function entrada(){
    let dados = {name: nome};
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
}

function tratarSucesso(resposta){
    console.log(resposta);
}

function tratarErro(erro){
    prompt("Esse nome já está em uso. Por favor, escolha outro nome:");
    entrada();
}