/* -----
 DOM
* ------- */

// creer les balise button dans la div
let divtri = document.getElementById('tri');
// recuperer l'emplacement de la gallery dans DOM
const gallery = document.querySelector('.gallery');

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

/* -----
 FUNCTIONS
* ------- */

function init() {
  getProjects().then((projects) => {
    createGallery(projects);
  });
  getCategories().then((categories) => {
    generateFiltersInHTML(categories);
  });
  getProjects().then((projects) => {
    createGalleryModal(projects);
  });
  getCategories().then((categories) => {
    generateCategorieInHTML(categories);
  });
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
// au click du lien 'modifier' le modal 1 devient visible
let lienModal1 = document.getElementById('lien-modal-1');
let body = document.querySelector('body');
let modal1 = document.getElementById('modal-1');
let modal2 = document.getElementById('modal-2');

lienModal1.addEventListener('click', () => {
  body.classList.add('background-assombri');
  modal1.classList.remove('hidden');
  modal1.classList.add('modal-visible');

  console.log(modal1);
});
// modal
function createGalleryModal(projects, filter = 0) {
  let galeryModal = document.getElementById('modal-gallery');
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].categoryId === filter || filter === 0) {
      let html = ` <figure>
            <img src="${projects[i].imageUrl}" alt="${projects[i].title}" />
          </figure>`;
      galeryModal.innerHTML += html;
    }
  }
}

// au click sur le bouton ajouter une photo le modal 1 laise place au modal 2
let ajouterPhoto = document.querySelector('.modal-button-1');
ajouterPhoto.addEventListener('click', () => {
  modal2.classList.add('z-index');
  modal2.classList.add('modal-visible');
  modal2.classList.remove('hidden');
  console.log(modal2);
});

// au click sur la flèche on repart sur le modal 1
let flecheGauche = document.querySelector('.fleche-gauche');
flecheGauche.addEventListener('click', () => {
  modal2.classList.remove('modal-visible');
  modal2.classList.add('hidden');
});
// au click sur la croix les module quitte
let croixQuitter = document.querySelector('.croix-quitter');
croixQuitter.addEventListener('click', () => {
  modal1.classList.remove('modal-visible');
  modal1.classList.add('hidden');
  modal2.classList.remove('modal-visible');
  modal2.classList.add('hidden');
  body.classList.remove('background-assombri');
});
let croixQuitter2 = document.querySelector('.croix-quitter-2');
croixQuitter2.addEventListener('click', () => {
  modal1.classList.remove('modal-visible');
  modal1.classList.add('hidden');
  modal2.classList.remove('modal-visible');
  modal2.classList.add('hidden');
  body.classList.remove('background-assombri');
});

// Au click en dehors du modal il quitte
let sectionMain = document.getElementById('main');
sectionMain.addEventListener('click', () => {
  modal1.classList.remove('modal-visible');
  modal1.classList.add('hidden');
  modal2.classList.remove('modal-visible');
  modal2.classList.add('hidden');
  body.classList.remove('background-assombri');
});

// ajout des categorie dans le modal 2
// let baliseCategorie = document.querySelectorAll('option');
// getCategories(category);
// baliseCategorie.forEach((category) => {
//   baliseCategorie.innerHTML = category.name;

//   console.log(baliseCategorie);
// });

function generateCategorieInHTML(categories) {
  let baliseCategorie = document.querySelectorAll('option');
  for (let i = 0; i < baliseCategorie.length; i++) {
    baliseCategorie[i].innerHTML = categories.name;
  }
}
// let baliseCategorie = document.querySelectorAll('option');
// for (let i = 0; i < baliseCategorie.length; i++) {
//   baliseCategorie[i].textContent += categories.name;

//   getCategories();
// }

/* -----
 INIT
* ------- */
init();
