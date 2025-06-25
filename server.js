//Importação do framework Express
import express from "express";
//importação do path e dirname para manipular caminhos
import path, { dirname } from "path";
//Importação do fileURLToPath para converter URL para caminho
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import multer from "multer";
import sequelize from "./db/declaracaoBD.js"
// import { Usuario } from "./db/tabeladb.js";
import {Estabelecimento} from "./db/tabelaDB.js";
import rota_usuarios from "./CRUDs/usuario.js";
import rota_lojas from "./CRUDs/estabelecimento.js"
import rota_servicos from "./CRUDs/servicos.js"
import rota_Avaliacao from "./CRUDs/avaliacao.js";
//Comentario

function verificarAutenticacao(req, res, next) {
    if (req.session.usuarioId) {
        next(); // usuário está logado
    } else {
        res.redirect("/login");
    }
}
function verificarAdm(req, res, next) {
    if (req.session.adm) {
        next(); // usuário está logado
    } else {
        res.redirect("/");
    }
}
const app = express();
app.use(express.json());
//Porta em que o servidor rodará
const port = 3000;
//diretório atual onde o servidor está rodando
const __dirname = dirname(fileURLToPath(import.meta.url));

// const sessionMaxAge = 10 * 60 * 1000;
// 1*30*1000 = 30 segs
//                   min * seg * ms
const sessionMaxAge = 60 * 60 * 1000;

app.use(session({
    secret: 'localtop',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: sessionMaxAge,
        httpOnly: true,
        secure: false,
    }
}));

app.use((req,res,next) => {
    if (req.session.user_logged_in) {
        req.session.cookies.expires = new Date(Date.now() + sessionMaxAge);
    }
    next();
})

app.use((req, res, next) => {
    res.locals.user_logged_in = req.session.user_logged_in || false;
    next();
});

//Configura o servidor para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use('/partials', express.static(path.join(__dirname, 'partials')));

app.use(rota_usuarios)
app.use(rota_lojas)
app.use(rota_servicos)
// app.use(rotas.rota_avaliacao)
// app.use(rotas.rota_servico)
// app.use(rotas.rota_oferta)
// app.use(rotas.rota_foto)

app.use(rota_Avaliacao);
// Ativa as rotas de avaliações

app.get("/auth/estado", (req, res) => {
    if (req.session && req.session.usuarioId) {
        res.json({ logado: true, usuarioId: req.session.usuarioId, nome: req.session.nome, adm: req.session.adm });
    } else {
        res.json({ logado: false});
    }
});

app.get('/auth/estabelecimento-logado', async (req, res) => {
    const usuarioId = req.session.usuarioId;
    if (!usuarioId) return res.status(401).json({ erro: 'Usuário não autenticado' });

    const est = await Estabelecimento.findOne({ where: { ID_usuario: usuarioId } });
    if (!est) return res.status(404).json({ erro: 'Estabelecimento não encontrado' });

    res.json(est);
});

//Quando acessar http://localhost:3000/ retorna o arquivo index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "index.html"));
});

app.get("/pesquisa", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "pesquisa.html"));
});

app.get("/estabelecimento", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "estabelecimento.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "signup.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "login.html"));
});

app.get("/perfil", (req,res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "perfilUsuario.html"));
})

// app.get("/lista",(req, res) => {
//     res.sendFile(path.join(__dirname, "public", "paginas", "usuariocrud.html"));
// });

app.get("/listaLojas",(req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "lojascrud.html"));
});
app.get("/listaUsuarios", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "usuariocrud.html"));
});

app.get("/sessao", (req, res) => {
    res.json(req.session.usuarioId == null ? {Resposta: "Não há sessão ativa"} : {usuarioId: req.session.usuarioId, nome: req.session.nome});
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ mensagem: "Erro ao tentar fazer logout." });
        }
        // Redireciona para a página de login após o logout
        res.redirect("/login");
    });
});

sequelize.sync().then(() => {
    app.listen(port,() => {
        console.log(`Servidor rodando http://localhost:${port}`);
    });
})


//inicia o servidor na porta 3000

// Para rodar o servidor, execute o comando:
// node server.js ou nodemon server.js