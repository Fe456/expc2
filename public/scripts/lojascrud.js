function mascaraCPF(event) {
    let input = event.target;
    let cpf = input.value.replace(/\D/g, "").slice(0, 11); // apenas números, máximo de 11 dígitos

    // Aplica a máscara de acordo com o tamanho do CPF
    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    input.value = cpf;
}

function validaCPF(cpf) {
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

function formatarCPF(cpf) {
    cpf = cpf.toString().padStart(11, '0');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function msgValidaCPF() {
    const cpf = document.getElementById('cpf').value;

    if (!validaCPF(cpf)) {
        Swal.fire(
            'CPF Inválido',
            '',
            'error'
        );
        document.getElementById('cpf').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

function listarLojas() {
    fetch('/api/estabelecimentos-completos', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById('TabelaCorpo');
            data.forEach(estabelecimento => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                <td class="linha">${estabelecimento.ID_estabelecimento}</td>
                <td class="linha"><input type="text" id="nome-${estabelecimento.ID_estabelecimento}" value="${estabelecimento.Nome}" readonly></td>
                <td class="linha"><input type="text" id="endereco-${estabelecimento.ID_estabelecimento}" value="${estabelecimento.Logradouro}" readonly></td>
                <td class="linha"><input type="text" id="numero-${estabelecimento.ID_estabelecimento}" value="${estabelecimento.Numero}" readonly></td>
                <td class="linha"><input type="text" id="compl-${estabelecimento.ID_estabelecimento}" value="${estabelecimento.Complemento || ''}" readonly></td>
                <td class="linha"><input type="text" id="cnpj-${estabelecimento.ID_estabelecimento}" value="${estabelecimento.Cnpj}" readonly></td>
                <td class="linha"><input type="text" id="cep-${estabelecimento.ID_estabelecimento}" value="${estabelecimento.CEP}" readonly></td>
                <td style="border: 2px solid #333; padding: 0;">
                    <button type="button" style="width: 100%; height: 100%; padding: 12px; background-color: red; border: none; color: white; font-weight: bold; cursor: pointer;" id="delete" onclick="PopUpDelete(${estabelecimento.ID_estabelecimento})">X</button>
                </td>
                <td style="border: 2px solid #333; padding: 0;">
                    <button type="button" style="width: 100%; height: 100%; padding: 12px; background-color: dodgerblue; border: none; color: white; font-weight: bold; cursor: pointer;" id="update" onclick="habilitarEdicao(${estabelecimento.ID_estabelecimento})">🔄</button>
                    </td>
                <td style="border: 2px solid #333; padding: 0;">
                    <button type="button" style="width: 100%; height: 100%; padding: 12px; background-color: green; border: none; color: white; font-weight: bold; cursor: pointer;" id="salvar" onclick="editarLoja(${estabelecimento.ID_estabelecimento})">💾</button>
                </td>
                `;
                tabela.appendChild(linha);
            });
        })
}
document.addEventListener('DOMContentLoaded', function () {
    listarLojas();
})

async function deletarLoja(id) {
    try {
        const response = await fetch(`/api/lojas/${id}`, {
            method: 'DELETE'
        })
        const result = await response.json()
        console.log(result.mensagem)
    } catch (error) {
        console.log(`Erro ao excluir o usuário: ${error}`)
    }
}

async function PopUpDelete(id) {
    const result = await Swal.fire({
    title: "Deseja deletar essa Loja?",
    text: "Não será possível reverter essa ação!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Deletar"
    });
    if (result.isConfirmed) {
        await deletarLoja(id)
        await Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
        });
        if (result.isConfirmed) { window.location.reload(); }
}

function habilitarEdicao(id) {
    const campos = ['nome', 'endereco', 'numero', 'compl', 'cnpj', 'cep'];
    
    campos.forEach(campo => {
        const input = document.getElementById(`${campo}-${id}`);
        if (input) {
            input.readOnly = false;
        } else {
            console.warn(`Campo ${campo}-${id} não encontrado no DOM`);
        }
    });
}


async function editarLoja(id) {
    const nome = document.getElementById(`nome-${id}`).value;
    const endereco = document.getElementById(`endereco-${id}`).value;
    const numero = document.getElementById(`numero-${id}`).value;
    const compl = document.getElementById(`compl-${id}`).value;
    const cnpj = document.getElementById(`cnpj-${id}`).value;
    const cep = document.getElementById(`cep-${id}`).value;

    try {
        console.log(id);
        const response = await fetch(`/api/lojas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: nome, endereco: endereco, numero: numero, complemento: compl, cnpj: cnpj, cep:cep })
        });
        const result = await response.json();
        console.log(result.mensagem);
        window.location.reload(); // Recarrega a tabela após a edição
    } catch (error) {
        console.log(`Erro ao editar a loja: ${error}`);
    }
}
}
