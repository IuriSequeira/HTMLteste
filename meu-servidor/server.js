require("dotenv").config();
console.log("JWT_SECRET carregado:", process.env.JWT_SECRET);

const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const jwtSecret = process.env.JWT_SECRET || "chave-padrao";

const app = express();
const PORT = 3000;

// Conexão com o banco de dados MySQL
let connection;
(async () => {
    try {
        connection = await mysql.createConnection({
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "iurisequeira",
            database: "basedados",
        });
        console.log("Conectado à base de dados MySQL.");
    } catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    }
})();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());
app.use(express.static(path.join(__dirname, "public")));

// Rota de registro
app.post("/registo", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    try {
        const [rows] = await connection.execute(
            "SELECT * FROM utilizadores WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ erro: "Email já está em uso." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        await connection.execute(
            "INSERT INTO utilizadores (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, hashedPassword]
        );

        res.status(200).json({ sucesso: "Utilizador registado com sucesso." });
    } catch (err) {
        console.error("Erro ao registrar utilizador:", err);
        res.status(500).json({ erro: "Erro ao processar seu pedido." });
    }
});

// Rota de login
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    try {
        const [results] = await connection.execute(
            "SELECT * FROM utilizadores WHERE email = ?",
            [email]
        );

        if (results.length === 0) {
            return res.status(400).json({ erro: "Utilizador não encontrado." });
        }

        const isMatch = await bcrypt.compare(senha, results[0].senha);

        if (!isMatch) {
            return res.status(400).json({ erro: "Senha incorreta." });
        }

        const token = jwt.sign({ id: results[0].id }, jwtSecret, {
            expiresIn: "1h",
        });

        console.log("Utilizador autenticado com sucesso.");
        res.status(200).json({
            sucesso: "Login bem-sucedido.",
            token: token,
        });
    } catch (err) {
        console.error("Erro ao processar o login:", err);
        res.status(500).json({ erro: "Erro ao processar seu pedido." });
    }
});

// Endpoint simples para verificar status do servidor
app.get("/", (req, res) => {
    res.send("Servidor funcionando corretamente!");
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});