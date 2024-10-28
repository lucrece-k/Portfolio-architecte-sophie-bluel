// Authentification de l’utilisateur
// variable globale
let baliseEmail = document.getElementById("email");
let baliseMotDePasse = document.getElementById("mot-de-passe");
let erreur = document.getElementById("erreur-email-mdp");
const form = document.querySelector("form");
const lienPageLogin = document.querySelector(".lien-page-login");

const apiLogin = "http://localhost:5678/api/users/login";

// INIT FUNCTION

function init() {
  addListenerOnSubmit();
}
if (lienPageLogin) {
  lienPageLogin.classList.add("caractere-gras");
}

function addListenerOnSubmit() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    erreur.innerHTML = "";
    verifierChamp(baliseEmail);
    verifierChamp(baliseMotDePasse);

    if (verifierChamp(baliseMotDePasse) && verifierChamp(baliseEmail)) {
      const user = {
        email: baliseEmail.value,
        password: baliseMotDePasse.value,
      };

      sendLoginRequest(JSON.stringify(user)).then((response) => {
        if (!response.token || response.token === undefined) {
          erreur.textContent = "Utilisateur unconnu";
          return;
        } else {
          /*Stocker le token dans le nvaigateur */
          localStorage.setItem("token", response.token);
          window.location = "index.html";
        }
      });
    }
  });
}

function verifierChamp(champ) {
  // si le champ est vide

  if (champ.value === "") {
    erreur.textContent = " Email et/ou mot de passe invalide";
    return false;
  }
  return true;
}

async function sendLoginRequest(user) {
  return await fetch(apiLogin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: user,
  }).then((response) => response.json());
}

init();
