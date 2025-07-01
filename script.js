const api = "https://ldrwin-backend.onrender.com";
let token = "";

function register() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  fetch(api + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: email.split("@")[0], email, senha })
  }).then(res => res.json()).then(data => {
    alert(data.msg || data.erro);
  });
}

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  fetch(api + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  }).then(res => res.json()).then(data => {
    if (data.token) {
      token = data.token;
      document.querySelector(".auth").style.display = "none";
      document.querySelector(".dashboard").style.display = "block";
      atualizarPerfil();
    } else {
      alert(data.erro);
    }
  });
}

function atualizarPerfil() {
  fetch(api + "/api/profile", {
    headers: { "Authorization": "Bearer " + token }
  }).then(res => res.json()).then(data => {
    document.getElementById("saldoReal").innerText = data.saldoReal.toFixed(2);
    document.getElementById("saldoBonus").innerText = data.saldoBonus.toFixed(2);
    document.getElementById("apostasAcumuladas").innerText = data.apostasAcumuladas.toFixed(2);
    document.getElementById("bonusLiberado").innerText = data.bonusLiberado ? "Sim" : "Não";
  });
}

function jogar() {
  const aposta = parseFloat(document.getElementById("aposta").value);
  const bombas = parseInt(document.getElementById("bombas").value);

  if (isNaN(aposta) || aposta < 0.5 || aposta > 100) {
    document.getElementById("mensagem").innerText = "Aposta deve ser entre R$0.50 e R$100.";
    return;
  }
  if (isNaN(bombas) || bombas < 3 || bombas > 24) {
    document.getElementById("mensagem").innerText = "Número de bombas deve ser entre 3 e 24.";
    return;
  }

  fetch(api + "/api/mines/play", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ aposta, bombas })
  }).then(res => res.json()).then(data => {
    if (data.erro) {
      document.getElementById("mensagem").innerText = data.erro;
    } else {
      document.getElementById("mensagem").innerText = data.mensagem;
      atualizarPerfil();
    }
  });
}
