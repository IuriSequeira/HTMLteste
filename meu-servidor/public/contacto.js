const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para permitir JSON e CORS
app.use(express.json());
app.use(cors());

// Rota para receber os dados e guardá-los no ficheiro
app.post("/mensagens", (req, res) => {
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const novaMensagem = `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}\n----------------------\n`;

    // Caminho do ficheiro onde guardar as mensagens
    const filePath = path.join(__dirname, "mensagens.txt");

    // Adiciona a mensagem ao ficheiro
    fs.appendFile(filePath, novaMensagem, (err) => {
        if (err) {
            console.error("Erro ao gravar a mensagem:", err);
            return res.status(500).json({ error: "Erro ao gravar a mensagem." });
        }
        console.log("Mensagem guardada com sucesso!");
        res.status(200).json({ message: "Mensagem enviada com sucesso!" });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
