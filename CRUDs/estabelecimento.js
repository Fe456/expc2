import {Router} from "express";
import {Estabelecimento} from "../db/tabelaDB.js";
import { Servico } from "../db/tabelaDB.js";
import { Avaliacao } from "../db/tabelaDB.js";
import { Oferta } from "../db/tabelaDB.js";
import { FotosEstabelecimento } from "../db/tabelaDB.js";
// import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import multer from "multer";
import path from 'path';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas imagens são permitidas.'), false);
        }
        cb(null,true);
    }
})


const rota_lojas = Router();


rota_lojas
.get('/api/estabelecimentos-completos', async (req, res) => {
  try {
    const estabelecimentos = await Estabelecimento.findAll({
      include: [
        { model: Oferta, as:'Ofertas', include: [{ model: Avaliacao, as: 'Avaliacao' }] }, // se quiser incluir ofertas e avaliações
        { model: FotosEstabelecimento, as: 'fotos' } // se tiver relacionamento com fotos
      ]
    });
    res.json(estabelecimentos);
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos completos:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
})
.get('/api/estabelecimento/usuario/:ID_usuario', async (req, res) => {
  const ID_usuario = req.params.ID_usuario;

  try {
    const estabelecimentos = await Estabelecimento.findAll({
      where: { ID_usuario }, // Assumindo que a tabela tem `usuarioId`
      include: {
        model: FotosEstabelecimento,
        as: 'fotos',
        attributes: ['ID_foto'],
        limit: 1
      }
    });

    res.json(estabelecimentos);
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos do usuário:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
})
.get('/api/estabelecimento/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const estabelecimento = await Estabelecimento.findOne({
      where: { ID_estabelecimento: id },
      include: {
        model: FotosEstabelecimento,
        as: 'fotos',
        attributes: ['ID_foto']
      }
    });

    if (!estabelecimento) {
      return res.status(404).json({ mensagem: "Estabelecimento não encontrado" });
    }

    console.log('Estabelecimento:', JSON.stringify(estabelecimento, null, 2));
    res.json(estabelecimento);
  } catch (error) {
    console.error("Erro ao buscar estabelecimento:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
})
.post('/api/estabelecimento/filtro', async (req, res) => {
    const { nome, nota } = req.body;

    try {
        // Filtra avaliações pela nota
        const avaliacoes = await Avaliacao.findAll({ where: { Nota: nota } });
        const ofertas = await Oferta.findAll();
        const estabelecimentos = await Estabelecimento.findAll();

        // Filtra os estabelecimentos que possuem ofertas com avaliações com a nota informada
        let encontrados = estabelecimentos.filter(estab =>
            ofertas.some(oferta =>
                oferta.ID_estabelecimento === estab.ID_estabelecimento &&
                avaliacoes.some(avaliacao =>
                    avaliacao.ID_oferta === oferta.ID_oferta &&
                    avaliacao.Nota === nota
                )
            )
        );
        // Filtro por nome
        if (encontrados.length !== 0) {
            let encontradosNome = encontrados.filter(e =>
                e.Nome.toLowerCase().includes(nome.toLowerCase())
            );

            // Lista de IDs dos estabelecimentos encontrados
            let ids = encontradosNome.map(e => e.ID_estabelecimento);

            // Buscar todos os dados com os includes
            let final = await Estabelecimento.findAll({
                where: {
                    ID_estabelecimento: ids
                },
                include: [{
                    model: Oferta,
                    as: 'Ofertas',
                    include: [{
                        model: Avaliacao,
                        as: 'Avaliacao'
                    }]
                }]
            })
            return res.status(200).json(final).end();
        }
        let encontradosNome = estabelecimentos.filter(e => e.Nome.toLowerCase().includes(nome.toLowerCase()));
        let ids = encontradosNome.map(e => e.ID_estabelecimento);
        let finalNome = await Estabelecimento.findAll({
            where: {
                ID_estabelecimento: ids
            },
            include: [{
                model: Oferta,
                as: 'Ofertas',
                include: [{
                    model: Avaliacao,
                    as: 'Avaliacao'
                }]
            }]
        })
        res.status(200).json(finalNome).end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})
// .post('/api/estabelecimento/filtro', async (req,res) => {
//   const { nome, nota } = req.body;
//
//   const estabelecimentos = await Estabelecimento.findAll();
//   const avaliacoes = await Avaliacao.findAll({ where: { Nota: nota } });
//   const ofertas = await Oferta.findAll();
//
//   console.log(req.body, avaliacoes, ofertas);
//
//   // Filtro correto
//   const encontrados = estabelecimentos.filter(estab =>
//     ofertas.some(oferta =>
//       oferta.ID_estabelecimento === estab.ID_estabelecimento &&
//       avaliacoes.some(avaliacao =>
//         avaliacao.ID_oferta === oferta.ID_oferta
//       )
//     )
//   );
//
//   const encontradosNome = encontrados.filter(e =>
//      e.Nome.toLowerCase().includes(nome.toLowerCase())
//   );
//   let final = [];
//   for (const estab of encontradosNome) {
//    final.push(await Estabelecimento.findAll({
//       where: {ID_estabelecimento: estab.ID_estabelecimento},
//       include: [{
//           model: Oferta, as: 'Ofertas',
//           include: [{
//               model: Avaliacao, as: 'Avaliacao'
//           }]
//       }]
//   }));
//     console.log(final);
//   res.status(200).json(final);
//
// }
// })
  rota_lojas
  .get('/api/estabelecimento/imagem/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const foto = await FotosEstabelecimento.findOne({ where: { ID_foto: id } });
  
      if (!foto) {
        res.status(200);
        res.setHeader('Content-Type', 'image/jpeg');
        return res.sendFile(path.resolve('../public/imagens/fachada-do-estabelecimento.jpg'));
      }
  
      res.setHeader('Content-Type', foto.TipoFoto || 'image/jpeg');
      res.send(foto.Foto);
    } catch (err) {
      console.error("Erro ao buscar foto:", err);
      res.status(500).send("Erro interno");
    }
  })
.get('/api/estabelecimentos', async (req, res) => {
  try {
    // const estabelecimentos = await Estabelecimento.findAll();
    const estabelecimentos = await Estabelecimento.findAll({
      include: [
        // {
        //   model: FotosEstabelecimento,
        //   as: 'FotosEstabelecimentos',
        //   attributes: ['Foto', 'TipoFoto'],
        //   limit: 1
        // },
        {
          model: Oferta,
          as: 'Ofertas',
          include: [
            { model: Servico,as:'Servico', attributes: ['Nome'] },
            { 
              model: Avaliacao,
              as: 'Avaliacaos',
              attributes: ['Nota']
            }
          ]
        }
      ]
    })
    estabelecimentos ? res.json(estabelecimentos) : res.status(400).json({erro: "não há nenhum estabelecimento registrado"});
    // ... resto da transformação em result e res.json(result)
  } catch (err) {
    console.error("Erro no /api/estabelecimentos-completos:", err);
    res.status(500).json({ erro: "Não foi possível carregar os estabelecimentos" });
  }
})
.post('/api/CriarEstabelecimento', async (req, res) => {
    const { Nome,Email,Telefone,Estado,Cidade,Bairro, Endereco, Numero, Complemento, CNPJ, CEP, usuarioId} = req.body;
    const lojas = await Estabelecimento.findOne({ where: { Cnpj: CNPJ } });
    // const id_usuario = 1 //req.session?.usuarioId;

    if (lojas) {
        return res.status(400).json({mensagem:"CNPJ ja cadastrado."});
    }

    console.log("Dados recebidos:", req.body); // Adicione isso para debug
    
    try {
        await Estabelecimento.create({
            Nome: Nome,
            Email:Email,
            Cnpj: CNPJ,
            Logradouro: Endereco,
            Numero: Numero ? Numero : null,
            Complemento: Complemento ? Complemento : null,
            Bairro: Bairro,
            Cidade: Cidade,
            UF: Estado,
            CEP: CEP,
            Telefone: Telefone,
            ID_usuario: usuarioId
        });

        res.status(200).json({ mensagem: "Estabelecimento cadastrado com sucesso." });
    } catch (error) {
        console.error("Erro ao cadastrar estabelecimento:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar estabelecimento: ${error}` }); // Retorne JSON
    }
})
.post('/api/CriarFotoEstabelecimento', upload.array('file'), async (req, res) => {
  const { CNPJ } = req.body;

  try {
    const loja = await Estabelecimento.findOne({ where: { Cnpj: CNPJ } });
    if (!loja) {
      return res.status(404).json({ mensagem: "Estabelecimento não encontrado." });
    }

    const idEstabelecimento = loja.ID_estabelecimento;

    // Verifica se há arquivos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensagem: "Nenhuma imagem enviada." });
    }

      for (const file of req.files) {
          await FotosEstabelecimento.create({
              Foto: file.buffer,
              TipoFoto: file.mimetype,
              ID_estabelecimento: idEstabelecimento
          });
      }

      res.status(200).json({ mensagem: `${req.files.length} imagens salvas com sucesso.` });

  } catch (error) {
      console.error("Erro ao cadastrar imagens:", error);
      res.status(500).json({ mensagem: `Erro ao cadastrar imagens: ${error}` });
  }
})
.post('/api/avaliacoes', async (req, res) => {
  try {
    const { nota, comentario, id_usuario, ID_estabelecimento } = req.body;

    console.log('Recebido:', req.body);

    const novaAvaliacao = await Avaliacao.create({
      Nota: nota,
      Comentario: comentario,
      Data: new Date(),
      ID_usuario: id_usuario,
      ID_estabelecimento: parseInt(ID_estabelecimento)
    });

    res.status(201).json(novaAvaliacao);
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    res.status(500).json({ erro: 'Erro ao criar avaliação' });
  }
})
.get('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const loja = await Estabelecimento.findByPk(id);
    return loja ? res.json(loja) : res.status(404).end();
})
.put('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, endereco, numero, cnpj, complemento, cep } = req.body;
    const loja = await Estabelecimento.findByPk(id);

    console.log("Dados recebidos:", req.body);

    if (!loja) {
        return res.status(404).json({ mensagem: 'Loja não encontrada.' });
    }
    
    const updated = await loja.update({ 
        Nome: nome,
        endereco: endereco,
        Numero: numero,
        Complemento: complemento,
        Cnpj: cnpj,
        CEP: cep
    });

    console.log(updated);

    return res.status(200).json({ mensagem: 'Loja atualizada com sucesso.' });
})
.delete('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const loja = await Estabelecimento.findByPk(id);
    return loja ? res.json(await loja.destroy()) : res.status(404).end();
});

const rota_servico = Router();
rota_servico

.get('/api/servico', async (req, res) => {
    const servicos = await Servico.findAll();
    res.json(servicos)
});

const rota_oferta = Router();
rota_oferta

.get('/api/oferta', async (req, res) => {
    const ofertas = await Oferta.findAll();
    res.json(ofertas)
});

const rota_avaliacao = Router();
rota_avaliacao

.get('/api/avaliacao', async (req, res) => {
    const avaliacaos = await Avaliacao.findAll();
    res.json(avaliacaos)
});

const rota_foto = Router();
rota_foto

.get('/api/foto', async (req, res) => {
    const fotos = await FotosEstabelecimento.findAll();
    res.json(fotos)
});

export default rota_lojas;

//export default {rota_lojas, rota_avaliacao,rota_foto,rota_oferta,rota_servico};


