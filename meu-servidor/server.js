const express = require("express");
const mysql = require("mysql2"); // Importa o pacote mysql2
const bcrypt = require("bcryptjs"); // Para hash de senhas
const jwt = require("jsonwebtoken"); // Para criar o token de autenticação
const path = require("path");

const app = express();
const PORT = 3000;

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1', // Ou o IP do seu servidor de banco de dados
    port: 3306, // Porta de conexão
    user: 'root', // Seu usuário MySQL
    password: 'iurisequeira', // Senha do seu banco
    database: 'meu_banco.sql' // Nome do banco de dados
});

// Conectar ao banco de dados MySQL
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados MySQL como ID ' + connection.threadId);
});

// Middleware
app.use(express.json()); // Suporte para JSON
app.use(express.urlencoded({ extended: true })); // Suporte para formulários
app.use(require("cors")()); // Permite requisições de outras origens

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

app.post("/registo", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    try {
        const [rows] = await connection.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ erro: "Email já está em uso." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        await connection.promise().query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword]);

        res.status(200).json({ sucesso: "Usuário registado com sucesso." });
    } catch (err) {
        console.error("Erro:", err);
        res.status(500).json({ erro: "Erro ao processar seu pedido. Tente novamente." });
    }
});

// Rota de login
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    // Verificar se o usuário existe
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("Erro ao verificar o usuário:", err);
            return res.status(500).json({ erro: "Erro ao processar seu pedido. Tente novamente." });
        }

        if (results.length === 0) {
            return res.status(400).json({ erro: "Usuário não encontrado." });
        }

        // Comparar a senha
        bcrypt.compare(senha, results[0].senha, (err, isMatch) => {
            if (err) {
                console.error("Erro ao comparar a senha:", err);
                return res.status(500).json({ erro: "Erro ao processar sua senha. Tente novamente." });
            }

            if (!isMatch) {
                return res.status(400).json({ erro: "Senha incorreta." });
            }

            // Criar o token JWT
            const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            console.log("Usuário autenticado com sucesso.");
            res.status(200).json({
                sucesso: "Login bem-sucedido.",
                token: token // Enviar o token de autenticação para o cliente
            });
        });
    });
});

// Endpoint simples para verificar status do servidor
app.get("/", (req, res) => {
    res.send("Servidor funcionando corretamente!");
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});