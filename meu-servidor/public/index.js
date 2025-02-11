// Função para exibir o pop-up
function showPopup() {
    document.getElementById('popup').style.display = 'flex';
}

// Função para fechar o pop-up
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Enviar dados do formulário de login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio normal do formulário

    const formData = new FormData(this);
    const data = {
        email: formData.get('email'),
        senha: formData.get('password')
    };

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert(data.sucesso);
            // Redirecionar ou fazer algo após o login bem-sucedido
        } else {
            alert(data.erro);
        }
    })
    .catch(error => alert("Erro ao fazer login"));
});

// Enviar dados do formulário de registo
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio normal do formulário

    const formData = new FormData(this);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        senha: formData.get('senha')
    };

    fetch("http://localhost:3000/registo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert(data.sucesso);
            closePopup(); // Fechar o pop-up após o registro bem-sucedido
        } else {
            alert(data.erro);
        }
    })
    .catch(error => alert("Erro ao registrar"));
});