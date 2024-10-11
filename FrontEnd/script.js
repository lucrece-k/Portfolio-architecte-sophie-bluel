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

async function getToken() {
  /* Fonction pour r&cupérer le tocken dans le navigateur et le stokcer dans la vairable _TOKEN */

  // const response = await fetch(apiLogin);
  // return response.json;
  window.localStorage.getItem('token');
}

/* -----
 FUNCTIONS
* ------- */
let token = getToken();
console.log(token);
function init() {
  getProjects().then((projects) => {
    createGallery(projects);

    if (token.length !== 0) {
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
  if (token.length !== 0) {
    displayAdminElement();
  }

  supprimerProjet();
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
async function createGalleryModal() {
  let baliseModalGallery = document.getElementById('modal_content');
  const projectsModal = await getProjects();
  projectsModal.forEach((projects) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const span = document.createElement('span');
    img.src = projects.imageUrl;
    span.id = projects.id;
    span.className = 'span-poubelle';
    figure.appendChild(img);
    figure.appendChild(span);
    baliseModalGallery.appendChild(figure);
  });
}

// fonction pour suprimer un projet de la gallery

function supprimerProjet() {
  let listeDesPoubelles = document.querySelectorAll('.span-poubelle');
  listeDesPoubelles.forEach((poubelle) => {
    poubelle.addEventListener('click', () => {
      console.log('poubelle localiser');
      const id = poubelle.id;
      const init = {
        method: 'DELETE',
        header: { 'content-type': 'application/json' },
      };
      fetch(api + 'works/' + id, init).then(async (response) => {
        if (!response.ok) {
          console.log('supression a echoue');
        }
        const data = await response.json();
        console.log('supression reussi voisi les' + data);
        createGalleryModal();
        createGallery();
      });
    });
  });
}

// function createGalleryModal(projects) {
//   let baliseModalGallery = document.getElementById('modal_content');
//   for (let i = 0; i < projects.length; i++) {
//     if (projects[i]) {
//       let html = ` <figure>
//             <img src="${projects[i].imageUrl}" alt="${projects[i].title}" />
//             <span></span>
//           </figure>`;
//       baliseModalGallery.innerHTML += html;
//     }
//   }
// }

// redirection vers la page login au click
let lienLogin = document.getElementById('login');
lienLogin.addEventListener('click', () => {
  window.location = 'login.html';
});

// au click du lien 'modifier' le modal et sont overlay devient visible
let lienModal = document.querySelector('.modifier');
let body = document.querySelector('body');
let overlay = document.getElementById('modal_overlay');
let modal = document.getElementById('modal');

lienModal.addEventListener('click', () => {
  overlay.classList.remove('visibility-hidden');
  modal.classList.remove('visibility-hidden');
  let titreModal = document.querySelector('.titre');
  titreModal.innerHTML = 'Galerie photo';
  let buttonAction = document.querySelector('.button-action');
  buttonAction.innerHTML = 'Ajouter une photo';
});
// // au click sur la croix le module quitte
let croixQuitter = document.querySelector('.croix-quitter');
croixQuitter.addEventListener('click', () => {
  modal.classList.add('visibility-hidden');
  overlay.classList.add('visibility-hidden');
});
// au click sur le overlay le modal quitte
let overlayQuitter = document.getElementById('modal_overlay');
overlayQuitter.addEventListener('click', () => {
  overlay.classList.add('visibility-hidden');
  modal.classList.add('visibility-hidden');
});

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
