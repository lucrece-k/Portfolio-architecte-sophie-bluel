// Authentification de l’utilisateur
// variable globale
let balisEmail = document.getElementById('email');
let email = balisEmail.value;
let baliseMotDePasse = document.getElementById('mot-de-passe');
let motDePasse = baliseMotDePasse.value;
let erreur = document.getElementById('erreur-email-mdp');

// function
function verifierChamp(champ, valeurAttendu) {
  // si le champ est different de se qui est attendu

  if (champ.value !== valeurAttendu) {
    erreur.textContent = ' Email et/ou mot de passe invalide';
    throw new Error(erreur);
  } else {
    window.location = 'index.html';
  }

  // if (email !== 'sophie.bluel@test.tld' && motDePasse !== 'S0phie') {
  //   erreur.textContent = ' Email et mot de passe invalide';
  //   throw new Error(erreur);
  // }
}
// function verifierLesDeuxChamp(champ, valeurAttendu) {
//   if (champ !== valeurAttendu && champ !== valeurAttendu) {
//     let erreur = document.getElementById('erreur-email-mdp');
//     erreur.textContent = ' Email et mot de passe invalide';
//     throw new Error(erreur);
//   } else {
//     window.location = 'index.html';
//   }
// }

let form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  try {
    event.preventDefault();
    verifierChamp(balisEmail, 'sophie.bluel@test.tld');
    verifierChamp(baliseMotDePasse, 'S0phie');
  } catch (Error) {}
});

// // empecher que la page se recharge
// const form = document.querySelector('form');
// form.addEventListener('submit', (event) => {
//   event.preventDefault();
//   // recuperer l'email taper par l'utilisateur et le verifier

//   let email = balisEmail.value;

//   if (email !== 'sophie.bluel@test.tld') {
//     let erreur = document.getElementById('erreur-email-mdp');
//     erreur.textContent = 'Email incorrecte';
//   }
//   // recuperer le mot de passe taper par l'utilisateur et le verifier

//   let motDePasse = baliseMotDePasse.value;
//   if (motDePasse !== 'S0phie') {
//     let erreur = document.getElementById('erreur-email-mdp');
//     erreur.textContent = 'Mot de passe incorrecte';
//   }
//   if (email !== 'sophie.bluel@test.tld' && motDePasse !== 'S0phie') {
//     let erreur = document.getElementById('erreur-email-mdp');
//     erreur.textContent = 'email et mot de passe incorrecte';
//   }
//   if (email === 'sophie.bluel@test.tld' && motDePasse === 'S0phie') {
//     window.location = 'index.html';
//   }
// });
// // recuperer la valeur du champ email
