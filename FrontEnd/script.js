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
/* -----
 INIT
* ------- */
init();
