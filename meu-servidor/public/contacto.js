document.addEventListener("DOMContentLoaded", () => {
    // Captura o formulário e adiciona evento de submissão
    const form = document.getElementById("formulario-contato");
    const successMessage = document.getElementById("successMessage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio tradicional do formulário

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        // Validação de campos vazios
        if (!nome || !email || !mensagem) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Validação simples de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        // Validação de comprimento da mensagem
        if (mensagem.length < 10) {
            alert("A mensagem deve conter pelo menos 10 caracteres.");
            return;
        }

        // Simulação de envio de dados via fetch
        try {
            const response = await fetch("/mensagem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, email, mensagem }),
            });

            if (response.ok) {
                successMessage.style.display = "block"; // Exibe a mensagem de sucesso
                setTimeout(() => {
                    successMessage.classList.add("fade-out"); // Inicia o efeito de fade
                }, 5000); // Tempo para o fade-out (5 segundos)
                form.reset(); // Limpa o formulário após o sucesso
            } else {
                alert("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
            }
        } catch (error) {
            alert("Erro de conexão. Verifique sua internet.");
            console.error("Erro ao enviar a mensagem:", error);
        }
    });
});