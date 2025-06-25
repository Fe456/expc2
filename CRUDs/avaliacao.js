import express from 'express';
import { Avaliacao, Oferta, Usuario } from '../db/tabelaDB.js';

const rota_Avaliacao = express.Router();

// Criar uma nova avaliação
rota_Avaliacao.post('/api/avaliacoes', async (req, res) => {
    console.log('Recebido:', req.body);
    const { nota, comentario, id_usuario, id_estabelecimento } = req.body;
    try {
        const novaAvaliacao = await Avaliacao.create({
            Nota: nota,
            Comentario: comentario,
            Data: new Date(),
            ID_usuario: id_usuario,
            ID_estabelecimento: id_estabelecimento
        });
        res.status(201).json(novaAvaliacao);
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        res.status(500).json({ erro: 'Erro ao criar avaliação', detalhes: error.message });
    }
});

// Listar todas as avaliações de uma oferta
rota_Avaliacao.get('/api/avaliacoes/:id', async (req, res) => {
    const idEstabelecimento = req.params.id;
  
    try {
      const avaliacoes = await Avaliacao.findAll({
        where: { ID_estabelecimento: idEstabelecimento },
        include: {
          model: Usuario,
          attributes: ['Nome'] // opcional, para exibir nome do usuário junto
        }
      });
  
      res.json(avaliacoes); // ← deve retornar array
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      res.status(500).json({ erro: 'Erro ao buscar avaliações' });
    }
  });

// Deletar uma avaliação
rota_Avaliacao.delete('/api/avaliacoes/:id_avaliacao', async (req, res) => {
    const { id_avaliacao } = req.params;
    try {
        const deletado = await Avaliacao.destroy({ where: { ID_avaliacao: id_avaliacao } });
        if (deletado) {
            res.json({ mensagem: 'Avaliação deletada com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Avaliação não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar avaliação', detalhes: error.message });
    }
});

export default rota_Avaliacao;
