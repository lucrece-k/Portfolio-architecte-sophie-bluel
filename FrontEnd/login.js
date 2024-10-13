// Authentification de l’utilisateur
// variable globale
let baliseEmail = document.getElementById('email');
let baliseMotDePasse = document.getElementById('mot-de-passe');
let erreur = document.getElementById('erreur-email-mdp');
const form = document.querySelector('form');

 const apiLogin = 'http://localhost:5678/api/users/login';

// INIT FUNCTION

function init() {
  addListenerOnSubmit();
}

  function addListenerOnSubmit() {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    erreur.innerHTML = '';
    verifierChamp(baliseEmail);
    verifierChamp(baliseMotDePasse);

    if (verifierChamp(baliseMotDePasse) && verifierChamp(baliseEmail)) {
      const user = {
        email: baliseEmail.value,
        password: baliseMotDePasse.value,
      };

      sendLoginRequest(JSON.stringify(user)).then((response) => {
       console.log(response.token)
        if (response.token!=="") {
          /*Stocker le token dans le nvaigateur */
          localStorage.setItem("token",response.token);
          window.location = 'index.html';

        } else {
          erreur.innerHTML = "Utilisateur unconnu";
        }
      });
    }
  });
}
 
function verifierChamp(champ) {
  // si le champ est vide 
  console.log(champ.value);
  if (champ.value === '') {
    erreur.innerHTML = ' Email et/ou mot de passe invalide';
    return false;
  }
  return true;
}

 async function sendLoginRequest(user) {
  return await fetch(apiLogin, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: user,
  }).then((response) => response.json());
}

init();
