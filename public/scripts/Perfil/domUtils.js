import { fotos, fotoMostrada, setFotoMostrada } from '../estabelecimentoStore.js';

export const mostrarFoto = () => {
    const input = document.getElementById('file');
    const img = document.getElementById('Perfilimg');
    img.style.backgroundImage = `url(${URL.createObjectURL(input.files[0])})`;
}

export function MostrarSenha() {
    const Atual = document.getElementById('senhaAtual');
    const campoSenha = document.getElementById('novaSenha');
    const campoSenha2 = document.getElementById('confirmarNovaSenha');
    const img = document.querySelectorAll('.imgOlho');
    if (campoSenha.type === 'password') {
        Atual.type = 'text';
        campoSenha.type = 'text';
        campoSenha2.type = 'text';
        for (let i = 0; i < img.length; i++) {
            img[i].src = '../imagens/SVGs/olho-fechado.svg';
        }
    } else {
        Atual.type = 'password';
        campoSenha.type = 'password';
        campoSenha2.type = 'password';
        for (let i = 0; i < img.length; i++) {
            img[i].src = '../imagens/SVGs/olho-aberto.svg';
        }
    }
}

export function mascaraCPF(input) {
    let cpf = input.value.replace(/\D/g, "").slice(0, 11); // apenas números, máximo de 11 dígitos

    // Aplica a máscara de acordo com tamanho do CPF
    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    input.value = cpf;
}

export function validaCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcDig = (factor, max) => {
        let total = 0;
        for (let i = 0; i < max; i++) {
            total += parseInt(cpf[i]) * (factor--);
        }
        let resto = (total * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const dig1 = calcDig(10, 9);
    const dig2 = calcDig(11, 10);

    return dig1 === parseInt(cpf[9]) && dig2 === parseInt(cpf[10]);
}

export function msgValidaCPF() {
    const cpf = document.getElementById('cpf').value;

    if (!validaCPF(cpf)) {
        Swal.fire(
            'CPF Inválido',
            '',
            'error'
        );
        document.getElementById('cpf').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

export function formatarCPF(cpf) {
    cpf = cpf.toString().padStart(11, '0');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function ValidarNome(nome) {
    const regex = /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/;
    if (nome.length < 8 || !regex.test(nome)) {
        Swal.fire(
            'Nome Inválido',
            'Por favor, insira um nome completo.',
            'error'
        );
        document.getElementById('nome').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

export function validarEmail(email) {
    const regex = /^[A-Za-z0-9._!#$%&*+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!regex.test(email)) {
        Swal.fire(
            'Email Inválido',
            'Por favor, insira um email v&aacute;lido.',
            'error'
        )
        document.getElementById('email').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

export function validarSenhas(senha, senhaConfirmar) {
    let mascara = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/


    if (senha.length < 8) {
        Swal.fire(
            'Senha Fraca',
            'A senha deve ter pelo menos 8 caracteres.',
            'error'
        );
        document.getElementById('senha').style.outline = '1px solid rgb(202, 50, 121)';
        document.getElementById('confirmarsenha').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    if (!mascara.test(senha)) {
        Swal.fire(
            'Senha Fraca',
            'A senha deve ter pelo menos uma letra maiúscula, uma letra minúscula, um número e um símbolo especial.',
            'error'
        );
        document.getElementById('senha').style.outline = '1px solid rgb(202, 50, 121)';
        document.getElementById('confirmarsenha').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    if (senha !== senhaConfirmar) {
        Swal.fire(
            'Senhas Diferentes',
            'O campo de senha e confirmação de senha devem ser iguais.',
            'error'
        );
        document.getElementById('senha').style.outline = '1px solid rgb(202, 50, 121)';
        document.getElementById('confirmarsenha').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

export function ValidarData(data) {
    let today = new Date();
    let dataNasc = new Date(data);

    let idade = today.getFullYear() - dataNasc.getFullYear();
    let m = today.getMonth() - dataNasc.getMonth();
    let d = today.getDate() - dataNasc.getDate();
    if (isNaN(dataNasc.getTime())) {
        Swal.fire(
            'Data Inválida',
            'Por favor, insira uma data v&aacute;lida.',
            'error'
        );
        document.getElementById('datanasc').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    if (m < 0 || (m === 0 && d < 0)) {
        idade--;
    }
    if (idade < 18) {
        Swal.fire(
            'Menor de idade',
            'Apenas maiores de idade podem se cadastrar.',
            'error'
        );
        document.getElementById('datanasc').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

export function formatarData(dataString) {
    const data = new Date(dataString);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // meses começam do 0
    const ano = String(data.getFullYear());

    return `${ano}-${mes}-${dia}`;
}

export function verificarNome(nome) {
    const regex = /^[A-Za-zÀ-ÿ-'.,]+(?:\s+[A-Za-zÀ-ÿ-'.,]+)*$/;
    if (nome.length <= 3) {
        Swal.fire({
            title:'Nome Inválido',
            text:'tamanho do nome inválido, digite um nome maior que 3 caracteres',
            icon:'error'
        })
        document.getElementById("nomeEstabele").style.border = "1px solid rgb(202, 50, 121)";
        return false
    }
    if (!regex.test(nome)) {
        Swal.fire({
            title:'Nome inválido',
            text: 'Insira apenas caracteres permitidos: letras Maúsculas,minúsculas, espaço, acentos, pontuação, -, \'',
            icon:'error'
        })
        document.getElementById("nomeEstabele").style.border = "1px solid rgb(202, 50, 121)";
        return false
    }
    return true;
}

export function mascaraTelefone(input) {
    let numero = input.value.replace(/\D/g, '');
    // Limita a 14 dígitos
    numero = numero.substring(0, 11);
    // Aplica a máscara progressivamente
    if (numero.length === 11) {
        numero = numero.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1)$2-$3");
    }else if (numero.length >= 7) {
        numero = numero.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1)$2-$3");
    } else if (numero.length >= 3) {
        numero = numero.replace(/^(\d{2})(\d{0,5})/, "($1)$2");
    }
    input.value = numero;
}

export function mascaraCNPJ(input) {
    let cnpj = input.value.replace(/\D/g, '');

    // Limita a 14 dígitos
    cnpj = cnpj.substring(0, 14);

    // Aplica a máscara progressivamente
    if (cnpj.length >= 13) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
    } else if (cnpj.length >= 9) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
    } else if (cnpj.length >= 5) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else if (cnpj.length >= 3) {
        cnpj = cnpj.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
    }

    input.value = cnpj;

}

export function mascaraCEP(input) {
    let cep = input.value.replace(/\D/g, '');
    cep = cep.substring(0, 8);
    cep = cep.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = cep;
}

export async function buscarCEP(CEP) {
    if (CEP.length < 8) {
        Swal.fire({
            title:'CEP Inválido',
            text:'CEP não encontrado',
            icon:'error'
        })
        document.getElementById("cep").style.border = "1px solid rgb(202, 50, 121)";
        return
    }
    const cep = CEP.replace(/\D/g, '');

    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();
    if (dados.erro) {
        Swal.fire({
            title:'CEP Inválido',
            text:'CEP não encontrado',
            icon:'error'
        })
        document.getElementById("cep").style.border = "1px solid rgb(202, 50, 121)";
        return;
    }
    console.log(await dados)
    document.getElementById('estado').value = dados.uf;
    document.getElementById('cidade').value = dados.localidade;
    document.getElementById('bairro').value = dados.bairro;
    document.getElementById('endereco').value = dados.logradouro;
}

export function VerificarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false; // Rejeita todos iguais

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
}

export function msgCNPJ(cnpj) {
    if (!VerificarCNPJ(cnpj)) {
        Swal.fire({
            title:'CNPJ Inválido',
            text:'CNPJ não encontrado',
            icon:'error'
        })
        document.getElementById("cnpj").style.border = "1px solid rgb(202, 50, 121)";
        return false
    }
    return true
}

export function mostrarFotoEstabelecimento(index) {
    const foto = document.getElementById('Estabelecimentoimg');
    const indexFoto = document.getElementById('indexFoto');
    const spans = document.querySelectorAll('[data-value]')
    if (fotos[index]) {
        setFotoMostrada(index);
        foto.style.backgroundImage = `url(${URL.createObjectURL(fotos[index])})`;
    }
}

export function ProximaFoto() {
    const spans =  document.querySelectorAll('[data-value]');
    mostrarFotoEstabelecimento(fotoMostrada+1);
    spans.forEach(span => {
        if (span.dataset.value !== `${fotoMostrada}`) {
            span.style.backgroundColor = 'transparent';
        } else {
            span.style.backgroundColor = '#3E996F';
        }
    })

}

export function AnteriorFoto() {
    const spans =  document.querySelectorAll('[data-value]');
    mostrarFotoEstabelecimento(fotoMostrada-1);
    spans.forEach(span => {
        if (span.dataset.value !== `${fotoMostrada}`) {
            span.style.backgroundColor = 'transparent';
        } else {
            span.style.backgroundColor = '#3E996F';
        }
    })
}

export function DeletarFoto() {
    const foto = document.getElementById('Estabelecimentoimg');
    const spans = document.getElementById('spans');

    if (isNaN(fotoMostrada) || fotoMostrada < 0 || fotoMostrada > fotos.length) {
        console.error("Índice inválido",fotoMostrada,fotos.length,isNaN(fotoMostrada));
        return;
    }

    fotos.splice(fotoMostrada, 1);

    if (fotos.length > 0) {
        spans.innerHTML = '';
        for (let i = 0; i < fotos.length; i++) {
            const span = document.createElement("span");
            span.dataset.value = `${i}`;
            spans.appendChild(span)
        }
        const novoIndex = Math.max(0, Math.min(fotoMostrada, fotos.length - 1));
        mostrarFotoEstabelecimento(novoIndex);
        const spansColor =  document.querySelectorAll('[data-value]');
        spansColor.forEach(span => {
            if (span.dataset.value !== `${fotoMostrada}`) {
                span.style.backgroundColor = 'transparent';
            } else {
                span.style.backgroundColor = '#3E996F';
            }
        })
    } else {
        foto.style.backgroundImage = `url('https://placehold.co/300x400?text=Adicione+sua+foto')`;
        spans.innerHTML = '<p> Nenhuma imagem Adicionada </p>';
    }

    console.log(fotos.length);
}

export function adicionarFoto() {
    const input = document.getElementById('fileEstabele');
    const novasFotos = Array.from(input.files);
    const spans = document.getElementById('spans');
    if (fotos.length + novasFotos.length > 5) {
        Swal.fire({
            title: 'Limite máximo atingido',
            text:'Máximo de 5 fotos',
            icon: 'warning'
        })
        return;
    }
    const indicePrimeiraNova = fotos.length; // antes de adicionar

    fotos.push(...novasFotos);

    spans.innerHTML = '';
    for (let i = 0; i < fotos.length; i++) {
        const span = document.createElement("span");
        span.dataset.value = `${i}`;
        spans.appendChild(span)
    }

    mostrarFotoEstabelecimento(indicePrimeiraNova);// mostra a primeira das novas

    const spansColor =  document.querySelectorAll('[data-value]');
    spansColor.forEach(span => {
        if (span.dataset.value !== `${fotoMostrada}`) {
            span.style.backgroundColor = 'transparent';
        } else {
            span.style.backgroundColor = '#3E996F';
        }
    })
    console.log(fotos);
}