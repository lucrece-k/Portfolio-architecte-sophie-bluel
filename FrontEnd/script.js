/* -----
 DOM
* ------- */

// creer les balise button dans la div
let divtri = document.getElementById('tri');
// recuperer l'emplacement de la gallery dans DOM
const gallery = document.querySelector('.gallery');
let _TOKEN = '';
console.log(_TOKEN);
/* -----
 VARIABLES
* ------- */
// vider la galery
// gallery.innerHTML = '';
// connextion a l'api
const api = 'http://localhost:5678/api/';

// recuperrer les donners de l'api
async function getProjects() {
  const reponse = await fetch(api + 'works');
  return await reponse.json();
}

async function getCategories() {
  const reponse = await fetch(api + 'categories');
  return await reponse.json();
}

function getToken() {
  /* Fonction pour r&cupérer le tocken dans le navigateur et le stokcer dans la vairable _TOKEN */
  _TOKEN = window.localStorage.getItem('token');
}

/* -----
 FUNCTIONS
* ------- */

function init() {
  getProjects().then((projects) => {
    createGallery(projects);

    if (_TOKEN.length !== 0) {
      createGalleryModal(projects);
    }
  });
  getCategories().then((categories) => {
    generateFiltersInHTML(categories);

    //   if (_TOKEN.length !== 0) {
    //     generateCategorieInHTML(categories);
    //   }
  });
  getToken();
  if (_TOKEN.length !== 0) {
    displayAdminElement();
  }
}

// remettre les image dans la galery
function createGallery(projects, filter = 0) {
  gallery.innerHTML = '';
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].categoryId === filter || filter === 0) {
      let html = ` <figure>
            <img src="${projects[i].imageUrl}" alt="${projects[i].title}" />
            <figcaption>${projects[i].title}</figcaption>
          </figure>`;
      gallery.innerHTML += html;
    }
  }
}

function generateFiltersInHTML(categories) {
  categories.unshift({ id: 0, name: 'Tous' });
  categories.forEach((category) => {
    let categoryButton = document.createElement('button');
    categoryButton.innerHTML = category.name;
    categoryButton.addEventListener('click', function () {
      getProjects().then((projects) => {
        createGallery(projects, category.id);
      });
    });
    divtri.appendChild(categoryButton);
  });
}

// mode admin
function displayAdminElement() {
  let baliseBanniere = document.querySelector('.banniere-noir');
  baliseBanniere.classList.remove('visibility-hidden');
  let baliseModifier = document.querySelector('.modifier');
  baliseModifier.classList.remove('visibility-hidden');
}
// creer la gallery sur le modal
function createGalleryModal(projects) {
  let baliseModalGallery = document.getElementById('modal_content');
  for (let i = 0; i < projects.length; i++) {
    if (projects[i]) {
      let html = ` <figure>
            <img src="${projects[i].imageUrl}" alt="${projects[i].title}" />
            
          </figure>`;
      baliseModalGallery.innerHTML += html;
    }
  }
}

// redirection vers la page login au click
let lienLogin = document.getElementById('login');
lienLogin.addEventListener('click', () => {
  window.location = 'login.html';
});

// au click du lien 'modifier' le modal et sont overlay devient visible
let lienModal = document.querySelector('.modifier');
let body = document.querySelector('body');
let modal = document.getElementById('modal_overlay');

lienModal.addEventListener('click', () => {
  modal.classList.remove('visibility-hidden');
  let titreModal = document.querySelector('.titre');
  titreModal.innerHTML = 'Galerie photo';
  let buttonAction = document.querySelector('.button-action');
  buttonAction.innerHTML = 'Ajouter une photo';
});
// // modal

// // au click sur le bouton ajouter une photo le modal 1 laise place au modal 2
// let ajouterPhoto = document.querySelector('.modal-button-1');
// ajouterPhoto.addEventListener('click', () => {
//   modal2.classList.add('modal-visible');
//   modal2.classList.remove('hidden');
//   console.log(modal2);
// });

// // au click sur la flèche on repart sur le modal 1
// let flecheGauche = document.querySelector('.fleche-gauche');
// flecheGauche.addEventListener('click', () => {
//   modal2.classList.remove('modal-visible');
//   modal2.classList.add('hidden');
// });
// // au click sur la croix les module quitte
// let croixQuitter = document.querySelector('.croix-quitter');
// croixQuitter.addEventListener('click', () => {
//   modal1.classList.remove('modal-visible');
//   modal1.classList.add('hidden');
//   modal2.classList.remove('modal-visible');
//   modal2.classList.add('hidden');
//   body.classList.remove('background-assombri');
// });
// let croixQuitter2 = document.querySelector('.croix-quitter-2');
// croixQuitter2.addEventListener('click', () => {
//   modal1.classList.remove('modal-visible');
//   modal1.classList.add('hidden');
//   modal2.classList.remove('modal-visible');
//   modal2.classList.add('hidden');
//   body.classList.remove('background-assombri');
// });

// // Au click en dehors du modal il quitte
// let sectionMain = document.getElementById('main');
// sectionMain.addEventListener('click', () => {
//   modal1.classList.remove('modal-visible');
//   modal1.classList.add('hidden');
//   modal2.classList.remove('modal-visible');
//   modal2.classList.add('hidden');
//   body.classList.remove('background-assombri');
// });

// // ajout des categorie dans le modal 2
// // let baliseCategorie = document.querySelectorAll('option');
// // getCategories(category);
// // baliseCategorie.forEach((category) => {
// //   baliseCategorie.innerHTML = category.name;

// //   console.log(baliseCategorie);
// // });

// function generateCategorieInHTML(categories) {
//   let baliseCategorie = document.querySelectorAll('option');
//   for (let i = 0; i < baliseCategorie.length; i++) {
//     baliseCategorie[i].innerHTML = categories.name;
//   }
// }
// // let baliseCategorie = document.querySelectorAll('option');
// // for (let i = 0; i < baliseCategorie.length; i++) {
// //   baliseCategorie[i].textContent += categories.name;

// //   getCategories();
// // }

// /* -----
//  INIT
// * ------- */
getToken();
init();
