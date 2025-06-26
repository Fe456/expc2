import { adicionarFoto, verificarNome, validarEmail, msgCNPJ } from './domUtils.js';
import { fotos } from '../estabelecimentoStore.js';
let fotoMostrada;

//document.getElementById('fileEstabele').addEventListener('change', adicionarFoto);

export async function adicionarLocalTop() {
    const nome = document.getElementById('nomeEstabele').value;
    const telefone = document.getElementById('telefone').value;
    const cnpj = document.getElementById('cnpj').value;
    const cep = document.getElementById('cep').value;
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;

    console.log(nome, telefone.replace(/\D/g,""), cnpj.replace(/\D/g,""), cep.replace(/\D/g,""), estado, cidade, bairro, endereco, numero, complemento);
    if (!verificarNome(nome)) return console.log('nome inválido') ;
    if (!msgCNPJ(cnpj)) return console.log('cnpj inválido') ;

    // const resposta = await fetch('/auth/estado');
    // const dados = await resposta.json();
    const response = await fetch('/api/CriarEstabelecimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Nome: nome,
            Telefone: telefone.replace(/\D/g,""),
            CNPJ: cnpj.replace(/\D/g,""),
            CEP: cep.replace(/\D/g,""),
            Estado: estado,
            Cidade: cidade,
            Bairro: bairro,
            Endereco: endereco,
            Numero: numero,
            Complemento: complemento,
            usuarioId: 1
        })
    })
    if (response.ok) {
        Swal.fire({
            title: 'Estabelecimento criado com sucesso',
            icon: 'success'
        })
        if (fotos.length === 0) {
            return
        }
        const formData = new FormData();
        formData.append("CNPJ", cnpj.replace(/\D/g, ""));
        const arquivos = document.getElementById('fileEstabele').files;
        
        for (let i = 0; i < arquivos.length; i++) {
          formData.append("file", arquivos[i]); // o mesmo nome 'file' para upload.array
        }
        
        const resposta = await fetch('/api/CriarFotoEstabelecimento', {
          method: 'POST',
          body: formData
        });
            if (resposta.ok) {
                Swal.fire({
                    title: 'Fotos adicionadas com sucesso',
                    icon: 'success'
                })
                fotos = [];
                mostrarFotoEstabelecimento(0);
            } else {
                const erro = resposta.json()
                Swal.fire({
                    title: 'Erro ao adicionar fotos',
                    text: `${erro.mensagem}`,
                    icon: 'error'
                });
            }
    } else {
        Swal.fire({
            title: 'Erro ao criar estabelecimento',
            text: `Verifique os dados e tente novamente${response.status}`,
            icon: 'error'
        });
    }
}

// async function pegarServicos() {
//     const SelectServicos = document.getElementById('tipoServico')
//     const response = await fetch('/api/servicos');
//         console.log(response);
//     if (response.ok) {
//         const servicos = await response.json();
//         SelectServicos.innerHTML = ' ';
//         const SelectDefault = document.createElement('option');
//         SelectDefault.value = 'Selecionar';
//         SelectDefault.textContent = 'Selecione uma opção';
//         SelectServicos.appendChild(SelectDefault);
//         console.log(servicos);
//         servicos.forEach(servico => {
//             const option = document.createElement('option');
//             option.value = servico.id;
//             option.textContent = servico.Nome;
//             SelectServicos.appendChild(option);
//         })
//         const Outro = document.createElement('option');
//         Outro.value = 'Outro';
//         Outro.textContent = 'Outro';
//         SelectServicos.appendChild(Outro);
//     }
// }

if (document.getElementById('cep')) document.getElementById('cep').addEventListener('input', function () {
    document.getElementById('cep').style.border = '1px solid rgba(62, 62, 62, 1)';
})

if (document.getElementById('cnpj')) document.getElementById('cnpj').addEventListener('input', function () {
    document.getElementById('cnpj').style.border = '1px solid rgba(62, 62, 62, 1)';
})

export function initAdicionarEstabelecimento() {
    document.getElementById("cep")?.addEventListener("input", () => { /*...*/ });
    document.getElementById("cnpj")?.addEventListener("input", () => { /*...*/ });
    document.querySelector(".criarEstabelecimento")?.addEventListener("click", adicionarLocalTop);
}