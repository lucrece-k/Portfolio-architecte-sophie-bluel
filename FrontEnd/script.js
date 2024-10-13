
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

/* Fonction pour récupérer le token dans le navigateur et le stocker dans la variable token */
async function getToken() {
  
  // recuperer le token stocker dans le localstorage
  const token = localStorage.getItem("token"); 
  if (token) {
    console.log("Token récupéré:", token);
    return token; 
  } else {
    console.log("Aucun token trouvé");
    return null; 
  }
}

const token = getToken()
/* -----
 FUNCTIONS
* ------- */

console.log(token)
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
logout();
  
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
let baliseBanniere = document.querySelector('.banniere-noir');
let baliseModifier = document.querySelector('.modifier');
function displayAdminElement() {
  baliseBanniere.classList.remove('visibility-hidden');
  baliseModifier.classList.remove('visibility-hidden');
}
function remouveAdminElement(){
  baliseBanniere.classList.add('visibility-hidden');
  baliseModifier.classList.add('visibility-hidden');
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
  supprimerProjet()
}

// fonction pour ajouter un logout dans le mode editer
function logout(){
  const lienlogout=document.createElement('li')
  lienlogout.classList.add('logout')
  lienlogout.innerText=("logout")
  const baliseParent =document.querySelector("header ul")
  baliseParent.appendChild(lienlogout)
  lienlogout.addEventListener("click",()=> {
    remouveAdminElement()
    lienlogout.classList.add("visibility-hidden")
    console.log('lien logout')
  })
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
        headers: { "accept": "*/*"+token.json},
      };
        fetch((api + 'works/' + id, init)).then(async (response) => {
          console.log(response)
        if (!response.ok) {
          console.log('supression a échoué');
          
        }
        const data = await response.json();
        console.log('supression reussi voici la'+data);
        createGalleryModal();
        createGallery();
      });
    });
  });
}



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
// // au click sur la croix le modal disparè
let croixQuitter = document.querySelector('.croix-quitter');
croixQuitter.addEventListener('click', () => {
  modal.classList.add('visibility-hidden');
  overlay.classList.add('visibility-hidden');
});
// au click sur le overlay le modal disparè
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
