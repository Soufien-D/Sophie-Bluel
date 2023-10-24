// Variables
let loginForm = document.getElementById("loginForm");
const ifError = document.querySelector(".if_error");

// Envoi des infos de connexion vers l'API et retour de la reponse
async function login(authentification) {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authentification),
  });

  return response.json();
}

// Controle si l'authentification est bonne ou non
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let authentification = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  if (authentification) {
    const response = await login(authentification);

    if (response.token) {
      localStorage.setItem("token", response.token);
      retourAccueil();
    } else {
      const ifError = document.querySelector(".if_error");
      ifError.style.display = "flex";
    }
  }
});

// Fonction retour a l'acceuil si l'authentification est bonne
function retourAccueil() {
  document.location.href = "index.html";
}
