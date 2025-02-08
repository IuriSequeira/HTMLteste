const express = require("express");
const fs = require("fs").promises; // Uso de promises modernas com fs
const path = require("path");

const app = express();
const PORT = 3000;
const MESSAGE_FILE = path.join(__dirname, "mensagens.txt");

// Middleware
app.use(express.json()); // Suporte para JSON
app.use(express.urlencoded({ extended: true })); // Suporte para formulários
app.use(require("cors")()); // Permite requisições de outras origens

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rota principal para o formulário
app.post("/mensagem", async (req, res) => {
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    const dataMensagem = `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}\n\n`;

    try {
        await fs.appendFile(MESSAGE_FILE, dataMensagem);
        console.log("Mensagem recebida e armazenada.");
        res.status(200).json({ sucesso: "Mensagem enviada com sucesso." });
    } catch (error) {
        console.error("Erro ao salvar mensagem:", error);
        res.status(500).json({ erro: "Erro ao processar sua mensagem. Tente novamente." });
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