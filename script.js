const cursos = [
    {
        nome: "ADMINISTRAÇÃO",
        icone: "💼",
        id: 1
    },

    {
        nome: "AGROPECUÁRIA",
        icone: "🚜",
        id: 2
    },

    {
        nome: "CONTABILIDADE",
        icone: "🧮",
        id: 3
    },

    {
        nome: "INFORMÁTICA",
        icone: "💻",
        id: 4
    },

    {
    nome:"financias",
    icone:" ",
    id: 5
    },
];

let cartas = [];

let primeiraCarta = null;
let segundaCarta = null;

let bloqueado = false;

let tentativas = 0;
let pares = 0;

let segundos = 0;
let intervalo = null;

let iniciado = false;

const tabuleiro = document.getElementById("tabuleiro");

const iniciar = document.getElementById("iniciar");

const reiniciar = document.getElementById("reiniciar");

const mensagem = document.getElementById("mensagem");


function embaralhar(lista) {

    return lista.sort(() => Math.random() - 0.5);

}


function atualizarInformacoes() {

    document.getElementById("tentativas").textContent = tentativas;

    document.getElementById("pares").textContent = pares + "/4";

    let minutos = Math.floor(segundos / 60);

    let segundosRestantes = segundos % 60;

    document.getElementById("tempo").textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(segundosRestantes).padStart(2, "0");

}


function iniciarCronometro() {

    clearInterval(intervalo);

    segundos = 0;

    intervalo = setInterval(() => {

        segundos++;

        atualizarInformacoes();

    }, 1000);

}


function criarCartas() {

    cartas = [];

    cursos.forEach(curso => {

        cartas.push({...curso});

        cartas.push({...curso});

    });

    embaralhar(cartas);

    tabuleiro.innerHTML = "";

    cartas.forEach((curso, indice) => {

        const carta = document.createElement("div");

        carta.classList.add("carta");

        carta.dataset.id = curso.id;

        carta.innerHTML = `

            <span class="interrogacao">?</span>

            <div class="conteudo">

                <span class="icone">${curso.icone}</span>

                <span class="nome">${curso.nome}</span>

            </div>

        `;

        carta.addEventListener("click", () => {

            virarCarta(carta);

        });

        tabuleiro.appendChild(carta);

    });

}


function virarCarta(carta) {

    if (!iniciado || bloqueado) return;

    if (
        carta.classList.contains("aberta") ||
        carta.classList.contains("combinada")
    ) return;

    carta.classList.add("aberta");

    if (!primeiraCarta) {

        primeiraCarta = carta;

        return;

    }

    segundaCarta = carta;

    tentativas++;

    atualizarInformacoes();

    verificarPar();

}


function verificarPar() {

    const igual =
        primeiraCarta.dataset.id === segundaCarta.dataset.id;

    if (igual) {

        primeiraCarta.classList.remove("aberta");

        segundaCarta.classList.remove("aberta");

        primeiraCarta.classList.add("combinada");

        segundaCarta.classList.add("combinada");

        pares++;

        atualizarInformacoes();

        limparSelecao();

        if (pares === 5) {

            vencerJogo();

        }

    } else {

        bloqueado = true;

        setTimeout(() => {

            primeiraCarta.classList.remove("aberta");

            segundaCarta.classList.remove("aberta");

            limparSelecao();

        }, 900);

    }

}


function limparSelecao() {

    primeiraCarta = null;

    segundaCarta = null;

    bloqueado = false;

}


function vencerJogo() {

    clearInterval(intervalo);

    iniciado = false;

    mensagem.innerHTML = `

        🏆 PARABÉNS! VOCÊ VENCEU!

        <br><br>

        Você encontrou todos os cursos!

        <br>

        Tentativas: ${tentativas}

        <br>

        Tempo: ${document.getElementById("tempo").textContent}

    `;

}


function iniciarJogo() {

    tentativas = 0;

    pares = 0;

    segundos = 0;

    primeiraCarta = null;

    segundaCarta = null;

    bloqueado = false;

    iniciado = true;

    mensagem.innerHTML = "";

    atualizarInformacoes();

    criarCartas();

    iniciarCronometro();

}


iniciar.addEventListener("click", iniciarJogo);

reiniciar.addEventListener("click", iniciarJogo);


// Preparar o tabuleiro inicial

criarCartas();

atualizarInformacoes();
