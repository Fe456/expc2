import { pegarDados } from './Perfil/initPerfil.js';
import { iniciarDropdown } from './Perfil/dropdown.js';
import { initAdicionarEstabelecimento } from './Perfil/adicionarEstabelecimento.js';

async function trocarmodal(index) {
    const modal = document.getElementById('informacao');
    if (!modal) return;

    const views = [
        { html: '../paginas/partials/perfil.html', js: '../scripts/perfil/perfil.js' },
        { html: '../paginas/partials/trocarSenha.html', js: '../scripts/perfil/trocarSenha.js' },
        { html: '../paginas/partials/addEstabelecimento.html', js: '../scripts/perfil/adicionarEstabelecimento.js' }
    ];

    try {
        const response = await fetch(views[index].html);
        const html = await response.text();
        modal.innerHTML = html;

        await new Promise(resolve => requestAnimationFrame(resolve));

        // Carrega o script correspondente
        const script = document.createElement('script');
        script.type = 'module'; // Use 'module' se estiver exportando funções
        script.src = views[index].js;

        // Remove script anterior, se houver
        const oldScript = document.getElementById('modal-script');
        if (oldScript) oldScript.remove();
        script.id = 'modal-script';

        document.body.appendChild(script);
        const module = await import(views[index].js);

        await new Promise(resolve => setTimeout(resolve, 0));

        if (index === 0 && module.initPerfil) module.initPerfil();
        if (index === 1 && module.initTrocarSenha) module.initTrocarSenha();
        if (index === 2 && module.initAdicionarEstabelecimento) module.initAdicionarEstabelecimento();
    } catch (err) {
        console.error('Erro ao carregar modal:', err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("conta").addEventListener("click", () => trocarmodal(0));
    document.getElementById("trocarsenha").addEventListener("click", () => trocarmodal(1));
    document.getElementById("AddEstabelecimento").addEventListener("click", () => trocarmodal(2));
    trocarmodal(0);

    pegarDados();
    iniciarDropdown();
    initAdicionarEstabelecimento();
});

let podeVerificar = true;

// Verifica o estado de login e, se estiver logado, ativa o monitoramento de sessão
const inicializarVerificacaoDeSessao = async () => {
    try {
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        if (dados.logado) {
            ativarMonitoramento();
        }
    } catch (err) {
        console.error("Erro ao verificar login inicial:", err);
    }
};
const verificarSessao = async () => {
    if (!podeVerificar) return;
    podeVerificar = false;
    try {
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        if (!dados.logado) {
            Swal.fire({
                icon: 'error',
                title: 'Sua sessão expirou',
                text: 'Aperte OK para ser redirecionado para a tela de login ou espere para ser redirecionado.',
                timer:5000,
                timerProgressBar: true
            }).then((result) => {
                sessionStorage.clear();
                if (result.isConfirmed) {
                    window.location.href = "/login";
                }
                if (result.dismiss === Swal.DismissReason.timer) {
                    window.location.href = "/login";
                }
            })
        }
    } catch (err) {
        console.error("Erro ao verificar sessão:", err);
    }
    setTimeout(() => {
        podeVerificar = true;
    }, 10000); // 10 segundos entre verificações
};
const ativarMonitoramento = () => {
    ['click', 'keydown', 'mousemove', 'scroll'].forEach(evento => {
        document.addEventListener(evento, verificarSessao);
    });
};
// Inicia tudo ao carregar a página
inicializarVerificacaoDeSessao();
async function logout() {
    try {
        const resposta = await fetch("/logout", {
            method: "GET",
        });
        if (resposta.ok) {
            // Quando o logout for bem-sucedido, redireciona para o login ou página inicial
            window.location.href = "/login";
        } else {
            alert("Erro ao fazer logout.");
        }
    } catch (err) {
        console.error("Erro ao fazer logout:", err);
    }
}
document.getElementById("logoutBtn").addEventListener("click", logout);
