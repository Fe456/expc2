import { formatarCPF, formatarData, ValidarData, ValidarNome, msgValidaCPF, validarEmail } from './domUtils.js';

export async function pegarDados() {
    const displayNome = document.getElementById('NomeEmail');
    const nome = document.getElementById('nomeUsu');
    if (!displayNome || !nome) {
        console.warn("Elementos de usuário não encontrados. Abortando.");
        return;
    }

    try {
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        console.log(dados);

        const response = await fetch(`/api/usuario/${dados.usuarioId}`);
        const usuario = await response.json();

        document.getElementById('nome').value = usuario.Nome;
        document.getElementById('email').value = usuario.Email;
        document.getElementById('cpf').value = formatarCPF(usuario.CPF);
        document.getElementById('datanasc').value = formatarData(usuario.DataNasc);
        displayNome.innerHTML = `<h4>${usuario.Nome.split(" ")[0].charAt(0).toUpperCase() + usuario.Nome.split(" ")[0].slice(1)}</h4><h5>${usuario.Email}</h5>`;
        nome.innerHTML = usuario.Nome.split(" ")[0].charAt(0).toUpperCase() + usuario.Nome.split(" ")[0].slice(1);

        // carregamento de imagem
        const responseImg = await fetch(`/api/usuario/${dados.usuarioId}/foto`);
        if (responseImg.ok) {
            const img = await responseImg.blob();
            const url = URL.createObjectURL(img);
            document.getElementById('imgPerfil').style.backgroundImage = `url(${url})`;
            document.getElementById('Perfilimg').style.backgroundImage = `url(${url})`;
            document.querySelector(".ImgUsuario").src = url;
        } else {
            console.log("Sem imagem de perfil ou erro ao carregar imagem.");

            const defaultURL = "../imagens/SVGs/perfil.svg";
            const imgUsuario = document.querySelector(".ImgUsuario");
            const imgPerfil = document.getElementById('imgPerfil');
            if (imgUsuario) imgUsuario.src = defaultURL;
            if (imgPerfil) imgPerfil.style.backgroundImage = `url(${defaultURL})`;
        }
    } catch (error) {
        console.error(`Erro ao requisitar dados do banco: ${error}`);
    }
}

export async function UpdateDados() {
    try {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const dataNasc = document.getElementById('datanasc').value;
        const cpf = document.getElementById('cpf').value;
        const foto = document.getElementById('file')
        const btns = document.getElementById("btns");
        if (!ValidarNome(nome)) return;
        if (!validarEmail(email)) return;
        if (!ValidarData(dataNasc)) return;
        if (!msgValidaCPF(cpf)) return;
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('dataNascimento', dataNasc);
        formData.append('cpf', cpf);
        foto.files[0] ? formData.append('file', foto.files[0]) : null;
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        const response = await fetch(`/api/usuario/${dados.usuarioId}`, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            Swal.fire({
                title: 'Erro ao atualizar os dados!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        const result = await response.json();
        pegarDados().then(mudarCampos);
        btns.innerHTML =`<button type="button" class="mudarcampos" onclick="mudarCampos()">Mudar informações</button>`
        console.log('Atualização realizada com sucesso:', result);
        Swal.fire({
            tittle: 'Dados atualizados com sucesso!',
            text: `${dados.nome}Seus dados foram atualizados com sucesso.`,
            icon: 'success',
            confirmButtonText: 'OK'
        })
    } catch (error) {
        console.log(`Erro ao atualizar os dados do banco.\n${error}`);
    }
}

export async function UpdateSenha() {
    try {
        const senhaAtual = document.getElementById('senhaAtual').value;
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarNovaSenha = document.getElementById('confirmarNovaSenha').value;
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        const responseSenha = await fetch(`/api/usuario/${dados.usuarioId}/verificarsenha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senhaAtual, novaSenha })
        })
        const usuario = await responseSenha.json();
        if (!responseSenha.ok) {
            Swal.fire({
                title: 'Erro ao atualizar a senha!',
                text: `${usuario.mensagem}`,
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        }
        if (!validarSenhas(novaSenha, confirmarNovaSenha)) return;
        const response = await fetch(`/api/usuario/${dados.usuarioId}/Novasenha`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ novaSenha })
        });
        if (!response.ok) {
            let erro = await response.json();
            Swal.fire({
                title: 'Erro ao atualizar a senha!',
                text: `${erro.mensagem}`,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        Swal.fire({
            title: 'Senha atualizada com sucesso!',
            text: `${dados.nome}, Sua senha foi atualizada com sucesso.`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('senhaAtual').value = '';
                document.getElementById('novaSenha').value = '';
                document.getElementById('confirmarNovaSenha').value = '';
                trocarmodal(0)
            }
        })
    } catch (error) {
        console.log(`Erro ao atualizar a senha do banco.\n${error}`);
    }
}

export function initPerfil() {
    pegarDados();
  }