const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware para tratar dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static('public'));

// Rota para receber mensagens do formulário
app.post('/mensagem', (req, res) => {
    const { nome, email, mensagem } = req.body;
    const logMensagem = `Nome: ${nome}, Email: ${email}, Mensagem: ${mensagem}\n`;

    // Guardar mensagem no ficheiro mensagens.txt
    fs.appendFile('mensagens.txt', logMensagem, (err) => {
        if (err) {
            console.error('Erro ao guardar a mensagem:', err);
            res.status(500).send('Erro ao enviar a mensagem.');
        } else {
            res.send('Mensagem recebida e armazenada com sucesso.');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});
