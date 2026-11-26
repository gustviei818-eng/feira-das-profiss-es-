const cursos = [
{
nome: “ADMINISTRAÇÃO”,
icone: “💼”,
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
    nome: "FINANÇAS",
    icone: "💰",
    id: 5
}

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

let animacaoConfetes = null;

const tabuleiro = document.getElementById(“tabuleiro”);

const iniciar = document.getElementById(“iniciar”);

const reiniciar = document.getElementById(“reiniciar”);

const mensagem = document.getElementById(“mensagem”);

const canvas = document.getElementById(“confetes”);

const ctx = canvas.getContext(“2d”);

function embaralhar(lista) {

return lista.sort(() => Math.random() - 0.5);

}

function atualizarInformacoes() {

document.getElementById("tentativas").textContent = tentativas;
document.getElementById("pares").textContent = pares + "/5";
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
cartas.forEach(curso => {
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
    <div class="tela-vitoria">
        <h1>🏆 PARABÉNS!</h1>
        <h2>VOCÊ VENCEU!</h2>
        <div class="icone-vitoria">💻</div>
        <h1>VEM SER INFORMÁTICA!!</h1>
        <p>EEEP Dr. Napoleão Neves da Luz</p>
        <p>Feira das Profissões 2026</p>
        <h3>Obrigado por participar!</h3>
        <p>Tentativas: ${tentativas}</p>
        <p>Tempo: ${document.getElementById("tempo").textContent}</p>
        <button onclick="iniciarJogo()">
            JOGAR NOVAMENTE
        </button>
    </div>
`;
soltarConfetes();

}

/* ANIMACAO DOS CONFETES */

function soltarConfetes() {

pararConfetes();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cores = [
    "#ff0000",
    "#ffd700",
    "#00ff88",
    "#00d4ff",
    "#ff00ff",
    "#ffffff"
];
let particulas = [];
for (let i = 0; i < 180; i++) {
    particulas.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height,
        tamanho: Math.random() * 9 + 4,
        velocidade: Math.random() * 4 + 2,
        lado: Math.random() * 4 - 2,
        cor: cores[Math.floor(Math.random() * cores.length)],
        rotacao: Math.random() * 360
    });
}
let quadros = 0;
function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulas.forEach(p => {
        p.y += p.velocidade;
        p.x += p.lado;
        p.rotacao += 5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotacao * Math.PI / 180);
        ctx.fillStyle = p.cor;
        ctx.fillRect(
            -p.tamanho / 2,
            -p.tamanho / 2,
            p.tamanho,
            p.tamanho
        );
        ctx.restore();
    });
    particulas = particulas.filter(p => p.y < canvas.height + 20);
    quadros++;
    if (particulas.length > 0 && quadros < 500) {
        animacaoConfetes = requestAnimationFrame(animar);
    } else {
        pararConfetes();
    }
}
animar();

}

function pararConfetes() {

if (animacaoConfetes !== null) {
    cancelAnimationFrame(animacaoConfetes);
    animacaoConfetes = null;
}
ctx.clearRect(0, 0, canvas.width, canvas.height);

}

/* INICIAR PARTIDA */

function iniciarJogo() {

clearInterval(intervalo);
pararConfetes();
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

iniciar.addEventListener(“click”, iniciarJogo);

reiniciar.addEventListener(“click”, iniciarJogo);

criarCartas();

atualizarInformacoes();