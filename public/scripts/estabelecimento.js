const idOferta = 1; // Defina dinamicamente se possível

async function getUsuarioLogado() {
    try {
        const response = await fetch('/auth/estado'); // ou '/sessao'
        if (!response.ok) throw new Error('Erro na requisição');

        const data = await response.json();

        // Usando a rota /auth/estado:
        if (data.logado) {
            return { id: data.usuarioId, nome: data.nome, adm: data.adm };
        } 

        // Ou, para /sessao, checar se tem usuarioId:
        // if (data.usuarioId) return { id: data.usuarioId, nome: data.nome };

        return null; // não logado
    } catch (error) {
        console.error('Erro ao obter usuário logado:', error);
        return null;
    }
}

// Função para carregar avaliações da oferta
async function carregarAvaliacoes() {
    const divAvaliacoes = document.getElementById('avaliacoes');

    try {
        const response = await fetch(`/api/avaliacoes/${idOferta}`);
        const avaliacoes = await response.json();

        console.log('Retorno da API:', avaliacoes);

        // Limpa avaliações antigas
        divAvaliacoes.innerHTML = '';
        
        const titulo = document.createElement('h2');
        titulo.textContent = 'Avaliações:';
        divAvaliacoes.appendChild(titulo);

        if (avaliacoes.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Sem avaliações ainda.';
            divAvaliacoes.appendChild(p);
            return;
        }

        avaliacoes.forEach(av => {
            const div = document.createElement('div');

            const strong = document.createElement('strong');
            strong.textContent = `${av.Usuario.Nome}`;
            div.appendChild(strong);

            const textoNota = document.createTextNode(` - Nota: ${av.Nota}`);
            div.appendChild(textoNota);

            div.appendChild(document.createElement('br'));

            const p = document.createElement('p');
            p.textContent = av.Comentario;
            div.appendChild(p);

            const hr = document.createElement('hr');
            div.appendChild(hr);

            divAvaliacoes.appendChild(div);
        });

    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
    }
}

async function carregarEstabelecimento() {
    const id = localStorage.getItem("estabelecimentoSelecionado");
    console.log('ID usado na requisição:', id);
    if (!id) {
        console.error("Nenhum estabelecimento selecionado");
        // Opcional: redirecionar de volta
    }

    try {
        const response = await fetch(`/api/estabelecimento/${id}`);

        if (!response.ok) {
            console.error("Erro ao carregar dados:", response.status);
            return;
          }

        const est = await response.json();
        document.getElementById('nome').textContent = est.Nome;
        document.getElementById('contato').textContent = est.Telefone || 'Sem telefone cadastrado';

        const imgElement = document.querySelector('.carousel-item img');

        if (est.fotos && est.fotos.length > 0) {
        // Busca a imagem via fetch + blob
        const imgResponse = await fetch(`/api/estabelecimento/imagem/${est.fotos[0].ID_foto}`);
        if (imgResponse.ok) {
            const blob = await imgResponse.blob();
            const url = URL.createObjectURL(blob);
            imgElement.src = url;
        } else {
            imgElement.src = "../imagens/fachada-do-estabelecimento.jpg";
        }
        } else {
        imgElement.src = "../imagens/fachada-do-estabelecimento.jpg";
        }

    } catch (err) {
        console.error("Erro ao carregar dados:", err);
    }
}

// Evento para enviar avaliação
async function SubmitComentario() {
    const notaSelecionada = document.querySelector('input[name="avaliacao"]:checked');
    const comentario = document.getElementById('comentario').value;

    if (!notaSelecionada) {
        alert('Por favor, selecione uma nota.');
        return;
    }

    const nota = notaSelecionada.value;

    const usuario = await getUsuarioLogado();
    if (!usuario) {
        alert('Você precisa estar logado para enviar avaliação.');
        return;
    }

    const idEstabelecimento = localStorage.getItem('estabelecimentoSelecionado');

    try {
        console.log('ID do estabelecimento na avaliação:', idEstabelecimento);
        const response = await fetch('/api/avaliacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nota,
                comentario,
                id_usuario: usuario.id,
                ID_estabelecimento: idEstabelecimento
            })
        });

        if (response.ok) {
            alert('Avaliação enviada com sucesso!');
            carregarAvaliacoes();
        } else {
            alert('Erro ao enviar avaliação.');
        }
    } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
    }
}

// Carrega avaliações ao abrir a página
carregarAvaliacoes();
carregarEstabelecimento();
