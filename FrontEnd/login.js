// Authentification de l’utilisateur

// empecher que la page se recharge
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  // recuperer l'email taper par l'utilisateur et le verifier
  let balisEmail = document.getElementById('email');
  let email = balisEmail.value;

  if (email !== 'sophie.bluel@test.tld') {
    let erreur = document.getElementById('erreur-email-mdp');
    erreur.textContent = 'Email incorrecte';
  }
  // recuperer le mot de passe taper par l'utilisateur et le verifier
  let baliseMotDePasse = document.getElementById('mot-de-passe');
  let motDePasse = baliseMotDePasse.value;
  if (motDePasse !== 'S0phie') {
    let erreur = document.getElementById('erreur-email-mdp');
    erreur.textContent = 'Mot de passe incorrecte';
  }
  if (email !== 'sophie.bluel@test.tld' && motDePasse !== 'S0phie') {
    let erreur = document.getElementById('erreur-email-mdp');
    erreur.textContent = 'email et mot de passe incorrecte';
  }
  if (email === 'sophie.bluel@test.tld' && motDePasse === 'S0phie') {
    window.location = 'index.html';
  }
});
// recuperer la valeur du champ email
