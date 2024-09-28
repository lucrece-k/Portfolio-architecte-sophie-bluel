// connextion a l'api
const api = 'http://localhost:5678/api/';
// recuperer l'emplacement de la gallery dans DOM
const gallery = document.querySelector('.gallery');
// vider la galery
gallery.innerHTML = '';
// recuperrer les donners de l'api
async function getProjects() {
  const reponse = await fetch(api + 'works');
  const projects = await reponse.json();
  createGallery(projects);
}
// remettre les image dans la galery
function createGallery(projects, id = null) {
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].categoryId === id || id == null) {
      let html = ` <figure>
            <img src="${projects[i].imageUrl}" alt="${projects[i].title}" />
            <figcaption>${projects[i].title}</figcaption>
          </figure>`;
      gallery.innerHTML += html;
    }
  }
}
getProjects();
// creer un tableau pour les boutons trie
const tri = ['Tous', 'Objets', 'Appartements', 'Hotels & restaurants'];
// creer les balise button dans la div
let divtri = document.getElementById('tri');

for (let i = 0; i < tri.length; i++) {
  let balisebuttonTri = document.createElement('button');
  divtri.appendChild(balisebuttonTri);

  console.log(balisebuttonTri);
}
console.log(divtri);

// recuperer la liste des button et leur mettre leur contenu
let listebutton = document.querySelectorAll('#tri button');
for (let i = 0; i < listebutton.length; i++) {
  listebutton[i].textContent = tri[i];
}
