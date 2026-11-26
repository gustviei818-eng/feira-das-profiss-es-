const cursos = [
{ nome: “ADMINISTRAÇÃO”, icone: “💼”, id: 1 },
    
{ nome: “AGROPECUÁRIA”, icone: “🚜”, id: 2 },
    
{ nome: “CONTABILIDADE”, icone: “🧮”, id: 3 },
    
{ nome: “INFORMÁTICA”, icone: “💻”, id: 4 },
    
{ nome: “FINANÇAS”, icone: “💰”, id: 5 },
    
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

const tabuleiro = document.getElementById(“tabuleiro”);
const iniciar = document.getElementById(“iniciar”);
const reiniciar = document.getElementById(“reiniciar”);

function embaralhar(lista) {
return lista.sort(() => Math.random() - 0.5);
}

function atualizarInformacoes() {
document.getElementById(“tentativas”).textContent = tentativas;
document.getElementById(“pares”).textContent = pares + “/5”;

let minutos = Math.floor(segundos / 60);
let resto = segundos % 60;
document.getElementById("tempo").textContent =
    String(minutos).padStart(2, "0") + ":" +
    String(resto).padStart(2, "0");

}

function criarCartas() {
cartas = [];

cursos.forEach(curso => {
    cartas.push({...curso});
    cartas.push({...curso});
});
embaralhar(cartas);
tabuleiro.innerHTML = "";
cartas.forEach(curso => {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.id = curso.id;
    carta.innerHTML = `
        <span class="interrogacao">?</span>
        <div class="conteudo">
            <span class="icone">${curso.icone}</span>
            <span class="nome">${curso.nome}</span>
        </div>
    `;
    carta.addEventListener("click", () => virarCarta(carta));
    tabuleiro.appendChild(carta);
});
console.log("Cartas criadas:", cartas.length);

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
if (primeiraCarta.dataset.id === segundaCarta.dataset.id) {
primeiraCarta.classList.add(“combinada”);
segundaCarta.classList.add(“combinada”);

    pares++;
    limparSelecao();
    atualizarInformacoes();
    if (pares === 5) {
        clearInterval(intervalo);
        iniciado = false;
        document.getElementById("mensagem").innerHTML = `
            <div class="tela-vitoria">
                <h1>🏆 PARABÉNS!</h1>
                <h2>VOCÊ VENCEU!</h2>
                <div class="icone-vitoria">💻</div>
                <h1>VEM SER INFORMÁTICA!!</h1>
                <p>EEEP Dr. Napoleão Neves da Luz</p>
                <p>Feira das Profissões 2026</p>
                <button onclick="iniciarJogo()">JOGAR NOVAMENTE</button>
            </div>
        `;
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

function iniciarJogo() {
clearInterval(intervalo);

tentativas = 0;
pares = 0;
segundos = 0;
primeiraCarta = null;
segundaCarta = null;
bloqueado = false;
iniciado = true;
document.getElementById("mensagem").innerHTML = "";
atualizarInformacoes();
criarCartas();
intervalo = setInterval(() => {
    segundos++;
    atualizarInformacoes();
}, 1000);

}

iniciar.addEventListener(“click”, iniciarJogo);
reiniciar.addEventListener(“click”, iniciarJogo);

// Mostrar as cartas imediatamente ao abrir o site
criarCartas();
atualizarInformacoes();
