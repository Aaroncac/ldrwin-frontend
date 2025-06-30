const api = "https://ldrwin-backend.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      try {
        const res = await fetch(api + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "dashboard.html";
        } else {
          document.getElementById("loginError").textContent = data.erro || "Erro ao fazer login";
        }
      } catch (err) {
        document.getElementById("loginError").textContent = "Erro de conexão com o servidor.";
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      try {
        const res = await fetch(api + "/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
        });
        const data = await res.json();
        if (data.msg) {
          window.location.href = "index.html";
        } else {
          document.getElementById("registerError").textContent = data.erro || "Erro ao cadastrar";
        }
      } catch (err) {
        document.getElementById("registerError").textContent = "Erro de conexão com o servidor.";
      }
    });
  }

  if (window.location.pathname.includes("dashboard.html")) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "index.html";
      return;
    }
    fetch(api + "/profile", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.nome) {
          document.getElementById("userData").textContent = "Usuário: " + data.nome;
        } else {
          localStorage.removeItem("token");
          window.location.href = "index.html";
        }
      });
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}