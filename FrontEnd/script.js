/* -----
 DOM
* ------- */

// creer les balise button dans la div
let divtri = document.getElementById("tri");
// recuperer l'emplacement de la gallery dans DOM
const gallery = document.querySelector(".gallery");

/* -----
 VARIABLES
* ------- */
// vider la galery
// gallery.innerHTML = '';
// connextion a l'api
const api = "http://localhost:5678/api/";

// recuperrer les donners de l'api
async function getProjects() {
  const reponse = await fetch(api + "works");
  return await reponse.json();
}

async function getCategories() {
  const reponse = await fetch(api + "categories");
  return await reponse.json();
}

let baliseBanniere = document.querySelector(".banniere-noir");
let baliseModifier = document.querySelector(".modifier");
function displayAdminElement() {
  baliseBanniere.classList.remove("visibility-hidden");
  baliseModifier.classList.remove("visibility-hidden");
}
function remouveAdminElement() {
  baliseBanniere.classList.add("visibility-hidden");
  baliseModifier.classList.add("visibility-hidden");
}
function logout() {
  const lienlogout = document.createElement("li");
  lienlogout.classList.add("logout");
  lienlogout.innerText = "logout";
  const baliseParent = document.querySelector("header ul");
  baliseParent.appendChild(lienlogout);
  lienlogout.addEventListener("click", () => {
    remouveAdminElement();
    lienlogout.classList.add("visibility-hidden");
    console.log("lien logout");
  });
}

// recuperer le token stocker dans le localstorage
const token = localStorage.getItem("token");
/* Fonction pour verifier le token  */
async function getToken() {
  // recuperer le token stocker dans le localstorage
  if (token.length !== 0) {
    displayAdminElement();
    logout();
  }
  if (token) {
    console.log("Token récupéré:", token);

    return token;
  } else {
    console.log("Aucun token trouvé");
    return null;
  }
}
getToken();

// const token = getToken()

/* -----
 FUNCTIONS
* ------- */

// console.log(token)
function init() {
  getProjects().then((projects) => {
    createGallery(projects);

    if (token.length !== 0) {
      createGalleryModal(projects);
    }
  });
  fermerModal();
  getCategories().then((categories) => {
    generateFiltersInHTML(categories);
  });
}

// remettre les image dans la galery
function createGallery(projects, filter = 0) {
  gallery.innerHTML = "";
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
  //categories.unshift({ id: 0, name: "Tous" });
  let categoryButton = document.createElement("button");
  categoryButton.innerHTML = "Tous";
  categoryButton.addEventListener("click", function () {
    getProjects().then((projects) => {
      createGallery(projects, 0);
    });
  });
  divtri.appendChild(categoryButton);

  categories.forEach((category) => {
    let categoryButton = document.createElement("button");
    categoryButton.innerHTML = category.name;
    categoryButton.addEventListener("click", function () {
      getProjects().then((projects) => {
        createGallery(projects, category.id);
      });
    });
    divtri.appendChild(categoryButton);
  });
}

let baliseModalGallery = document.querySelector(".modal_content");

async function createGalleryModal() {
  const projectsModal = await getProjects();
  projectsModal.forEach((projects) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    img.src = projects.imageUrl;
    span.id = projects.id;
    span.className = "span-poubelle";
    figure.appendChild(img);
    figure.appendChild(span);
    baliseModalGallery.appendChild(figure);
  });
  supprimerProjet();
}

function supprimerProjet() {
  let listeDesPoubelles = document.querySelectorAll(".span-poubelle");
  listeDesPoubelles.forEach((poubelle) => {
    poubelle.addEventListener("click", () => {
      console.log("poubelle localiser");
      const id = poubelle.id;
      const init = {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      };
      fetch(api + "works/" + id, init)
        .then(async (response) => {
          console.log(response);
          if (!response.ok) {
            console.log("supression a échoué");
            return;
          }
          const data = response;
          console.log("supression reussi voici la" + data);
          // Récupérer les données mises à jour après la suppression
          const updatedResponse = await fetch(api + "works");
          if (!updatedResponse.ok) {
            console.log("Échec de la récupération des travaux mis à jour");
            return;
          }
          const updatedData = await updatedResponse.json();
          baliseModalGallery.innerHTML = "";
          gallery.innerHTML = "";
          createGallery(updatedData); // Passez les données mises à jour à createGallery
          createGalleryModal(updatedData);
        })
        .catch((error) => {
          console.error("Erreur lors de la requête:", error);
        });
    });
  });
}

// redirection vers la page login au click
let lienLogin = document.getElementById("login");
lienLogin.addEventListener("click", () => {
  window.location = "login.html";
});

// au click du lien 'modifier' le modal et sont overlay devient visible
let lienModal = document.querySelector(".modifier");
let body = document.querySelector("body");
let overlay = document.getElementById("modal_overlay");
let modal = document.getElementById("modal");
let buttonAction = document.querySelector(".button-action");
let flecheRetour = document.querySelector(".fleche");
let titreModal = document.querySelector(".titre");

lienModal.addEventListener("click", () => {
  overlay.classList.remove("visibility-hidden");
  modal.classList.remove("visibility-hidden");

  titreModal.innerHTML = "Galerie photo";

  buttonAction.innerHTML = "Ajouter une photo";
});
function fermerModal() {
  // // au click sur la croix le modal disparè
  let croixQuitter = document.querySelector(".croix-quitter");
  croixQuitter.addEventListener("click", () => {
    modal.classList.add("visibility-hidden");
    overlay.classList.add("visibility-hidden");
  });
  // au click sur le overlay le modal disparè
  let overlayQuitter = document.getElementById("modal_overlay");
  overlayQuitter.addEventListener("click", () => {
    overlay.classList.add("visibility-hidden");
    modal.classList.add("visibility-hidden");
  });
}

// partie ajout photo de la modal au click sur ajouter une photo

buttonAction.addEventListener("click", () => {
  baliseModalGallery.innerHTML = "";
  let html = `<div id="contenu-modal-2">
  <form action="" class="form-ajout-photo">
  <svg xmlns="http://www.w3.org/2000/svg" width="70" height="61" viewBox="0 0 70 61" fill="none">
    <path d="M60.5517 6.88793C61.7228 6.88793 62.681 7.84612 62.681 9.01724V51.5768L62.0156 50.7118L43.9165 27.2894C43.3176 26.5042 42.3727 26.0517 41.3879 26.0517C40.4031 26.0517 39.4715 26.5042 38.8594 27.2894L27.8136 41.5824L23.7546 35.8998C23.1557 35.0614 22.1975 34.569 21.1595 34.569C20.1214 34.569 19.1632 35.0614 18.5644 35.9131L7.91783 50.8183L7.31896 51.6434V51.6034V9.01724C7.31896 7.84612 8.27715 6.88793 9.44827 6.88793H60.5517ZM9.44827 0.5C4.75048 0.5 0.93103 4.31945 0.93103 9.01724V51.6034C0.93103 56.3012 4.75048 60.1207 9.44827 60.1207H60.5517C65.2495 60.1207 69.069 56.3012 69.069 51.6034V9.01724C69.069 4.31945 65.2495 0.5 60.5517 0.5H9.44827ZM20.0948 26.0517C20.9337 26.0517 21.7644 25.8865 22.5394 25.5655C23.3144 25.2444 24.0186 24.7739 24.6118 24.1807C25.2049 23.5876 25.6755 22.8834 25.9965 22.1083C26.3175 21.3333 26.4828 20.5027 26.4828 19.6638C26.4828 18.8249 26.3175 17.9943 25.9965 17.2192C25.6755 16.4442 25.2049 15.74 24.6118 15.1468C24.0186 14.5537 23.3144 14.0831 22.5394 13.7621C21.7644 13.4411 20.9337 13.2759 20.0948 13.2759C19.2559 13.2759 18.4253 13.4411 17.6503 13.7621C16.8752 14.0831 16.171 14.5537 15.5779 15.1468C14.9847 15.74 14.5142 16.4442 14.1931 17.2192C13.8721 17.9943 13.7069 18.8249 13.7069 19.6638C13.7069 20.5027 13.8721 21.3333 14.1931 22.1083C14.5142 22.8834 14.9847 23.5876 15.5779 24.1807C16.171 24.7739 16.8752 25.2444 17.6503 25.5655C18.4253 25.8865 19.2559 26.0517 20.0948 26.0517Z" fill="#B9C5CC"/>
  </svg>
  <img id="nouveau-projet"/>
  <input type="file" id="file" name="file">
 <button onclick="file.click()" id="fileButton" class="button-ajouter-photo">+ Ajouter photo</button>
  <p>jpg, png : 4mo max</p>
</form>
<div class="input-paragraphe">
Titre<br>
<input type="text" name="titre" id="titre" />
Catégorie<br>
<select name="categorie-select" id="categorie-select">
</select>
</div>
</div>`;

  baliseModalGallery.innerHTML += html;
  flecheRetour.classList.remove("visibility-hidden");
  titreModal.innerHTML = "Ajout photo";
  buttonAction.innerHTML = "Valider";
  flecheRetour.addEventListener("click", () => {
    baliseModalGallery.innerHTML = "";
    createGalleryModal();
    buttonAction.innerHTML = "Ajouter une photo";
    titreModal.innerHTML = "Galerie photo";
    flecheRetour.classList.add("visibility-hidden");
  });
  let modalContent = document.querySelector("#contenu-modal-2"); // Contenu du modal
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation(); // Empêche la propagation de l'événement de clic
  });
  getCategories().then((categories) => {
    // generateFiltersInHTML(categories);

    if (token.length !== 0) {
      generateCategorieInHTML(categories);
    }
    telechargerNouveauProjet();
  });
});

function telechargerNouveauProjet() {
  const fileInput = document.getElementById("file");
  const fileButton = document.getElementById("fileButton");
  const nouveauProjet = document.getElementById("nouveau-projet");
  fileButton.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche la soumission par défaut
    fileInput.click(); // Déclenche la sélection de fichier
  });
  // Affichage de l'image quand le fichier est sélectionné
  fileInput.addEventListener("change", (event) => {
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        nouveauProjet.src = e.target.result;
        nouveauProjet.style.display = "block"; // Afficher l'image
      };

      reader.readAsDataURL(file); // Lire le fichier et générer une URL
    }
  });
}

function generateCategorieInHTML(categories) {
  const select = document.getElementById("categorie-select");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
// /* -----
//  INIT
// * ------- */

init();
