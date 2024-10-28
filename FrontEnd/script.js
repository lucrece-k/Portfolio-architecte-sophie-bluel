// creer les balise button dans la div
let divtri = document.getElementById("tri");
// recuperer l'emplacement de la gallery dans DOM
const gallery = document.querySelector(".gallery");

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
let lienLogin = document.getElementById("login");
let baliseBanniere = document.querySelector(".banniere-noir");
let baliseModifier = document.querySelector(".modifier");
function displayAdminElement() {
  baliseBanniere.classList.remove("visibility-hidden");
  baliseModifier.classList.remove("visibility-hidden");
  lienLogin.innerText = "logout";
  divtri.classList.add("visibility-hidden");
}
function remouveAdminElement() {
  baliseBanniere.classList.add("visibility-hidden");
  baliseModifier.classList.add("visibility-hidden");
}
function logout() {
  // Retire le eventlistener précédent
  lienLogin.removeEventListener("click", displayLeLogin);
  lienLogin.addEventListener("click", () => {
    remouveAdminElement();
    lienLogin.innerText = "login";
    // Supprime le token du localstorage
    localStorage.removeItem("token");
    // Recharge la page
    window.location.reload();
  });
}
logout();

// recuperer le token stocker dans le localstorage
const token = localStorage.getItem("token");

/* Fonction pour verifier le token  */
async function getToken() {
  if (token && token.length !== 0) {
    displayAdminElement();
  }
}

/* -----
 FUNCTIONS
* ------- */

function init() {
  getProjects().then((projects) => {
    createGallery(projects);
    getToken();
    if (token && token.length !== 0) {
      createGalleryModal(projects);
    }
  });
  fermerModal();
  getCategories().then((categories) => {
    generateFiltersInHTML(categories);
  });
  modalDeTelechargement();
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
function displayAdminElement() {
  baliseBanniere.classList.remove("visibility-hidden");
  baliseModifier.classList.remove("visibility-hidden");
  lienLogin.innerText = "logout";
  divtri.classList.add("visibility-hidden");
}
function remouveAdminElement() {
  baliseBanniere.classList.add("visibility-hidden");
  baliseModifier.classList.add("visibility-hidden");
}
let baliseModalGallery = document.querySelector(".modal-gallery");
let baliseContenuModal = document.querySelector(".contenu-modal");

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
          // on vide les deux gallery et on leur passe les nouvelles données
          baliseModalGallery.innerHTML = "";
          gallery.innerHTML = "";
          createGallery(updatedData);
          createGalleryModal(updatedData);
        })
        .catch((error) => {
          console.error("Erreur lors de la requête:", error);
        });
    });
  });
}

// redirection vers la page login au click
function displayLeLogin() {
  //  si l'utilisateur n'est pas connecté (pas de token)
  if (!localStorage.getItem("token")) {
    lienLogin.addEventListener("click", () => {
      window.location = "login.html";
    });
  }
}

displayLeLogin();

/* -----
 VARIABLES global
* ------- */
const lienModal = document.querySelector(".modifier");
const overlay = document.getElementById("modal_overlay");
const modal = document.getElementById("modal");
const buttonAction = document.querySelector(".button-action");
const flecheRetour = document.querySelector(".fleche");
const titreModal = document.querySelector(".titre");
const trait = document.querySelector(".trait");

// au click du lien 'modifier' le modal et sont overlay devient visible
lienModal.addEventListener("click", () => {
  overlay.classList.remove("visibility-hidden");
  modal.classList.remove("visibility-hidden");
  baliseModalGallery.classList.remove("display-none");
  titreModal.innerHTML = "Galerie photo";
  buttonAction.innerHTML = "Ajouter une photo";
});

function fermerModal() {
  // // au click sur la croix le modal disparait
  const croixQuitter = document.querySelector(".croix-quitter");
  croixQuitter.addEventListener("click", () => {
    modal.classList.add("visibility-hidden");
    overlay.classList.add("visibility-hidden");
  });
  // au click sur le overlay le modal disparait
  const overlayQuitter = document.getElementById("modal_overlay");
  overlayQuitter.addEventListener("click", () => {
    overlay.classList.add("visibility-hidden");
    modal.classList.add("visibility-hidden");
  });
}
function quitterModal() {
  overlay.classList.add("visibility-hidden");
  modal.classList.add("visibility-hidden");
}

// partie ajout photo de la modal au click sur ajouter une photo
function modalDeTelechargement() {
  buttonAction.addEventListener("click", () => {
    baliseModalGallery.classList.add("visibility-hidden");
    let html = `
  <form action="#" class="form-ajout-photo">
  <div class="contenu-ajout-photo">
  <svg xmlns="http://www.w3.org/2000/svg" width="70" height="61" viewBox="0 0 70 61" fill="none">
    <path d="M60.5517 6.88793C61.7228 6.88793 62.681 7.84612 62.681 9.01724V51.5768L62.0156 50.7118L43.9165 27.2894C43.3176 26.5042 42.3727 26.0517 41.3879 26.0517C40.4031 26.0517 39.4715 26.5042 38.8594 27.2894L27.8136 41.5824L23.7546 35.8998C23.1557 35.0614 22.1975 34.569 21.1595 34.569C20.1214 34.569 19.1632 35.0614 18.5644 35.9131L7.91783 50.8183L7.31896 51.6434V51.6034V9.01724C7.31896 7.84612 8.27715 6.88793 9.44827 6.88793H60.5517ZM9.44827 0.5C4.75048 0.5 0.93103 4.31945 0.93103 9.01724V51.6034C0.93103 56.3012 4.75048 60.1207 9.44827 60.1207H60.5517C65.2495 60.1207 69.069 56.3012 69.069 51.6034V9.01724C69.069 4.31945 65.2495 0.5 60.5517 0.5H9.44827ZM20.0948 26.0517C20.9337 26.0517 21.7644 25.8865 22.5394 25.5655C23.3144 25.2444 24.0186 24.7739 24.6118 24.1807C25.2049 23.5876 25.6755 22.8834 25.9965 22.1083C26.3175 21.3333 26.4828 20.5027 26.4828 19.6638C26.4828 18.8249 26.3175 17.9943 25.9965 17.2192C25.6755 16.4442 25.2049 15.74 24.6118 15.1468C24.0186 14.5537 23.3144 14.0831 22.5394 13.7621C21.7644 13.4411 20.9337 13.2759 20.0948 13.2759C19.2559 13.2759 18.4253 13.4411 17.6503 13.7621C16.8752 14.0831 16.171 14.5537 15.5779 15.1468C14.9847 15.74 14.5142 16.4442 14.1931 17.2192C13.8721 17.9943 13.7069 18.8249 13.7069 19.6638C13.7069 20.5027 13.8721 21.3333 14.1931 22.1083C14.5142 22.8834 14.9847 23.5876 15.5779 24.1807C16.171 24.7739 16.8752 25.2444 17.6503 25.5655C18.4253 25.8865 19.2559 26.0517 20.0948 26.0517Z" fill="#B9C5CC"/>
  </svg>
  <img id="nouveau-projet" alt="Aperçut de l'image"/>
  <label for="file">+ Ajouter photo</label>
  <input type="file" id="file" name="file">
  <p>jpg, png : 4mo max</p>
</div> 
<div class="input-paragraphe">
<label for="titre">Titre</label>
<input type="text" name="titre" id="titre" />
<label for="categorie-select">Catégorie</label>
<select name="categorie-select" id="categorie-select">
</select>
</div>
<div class="trait-ajout-photo"></div>
<button type="submit" class="submit-photo">Valider</button>
</form>
`;

    baliseContenuModal.innerHTML += html;
    flecheRetour.classList.remove("visibility-hidden");
    titreModal.innerHTML = "Ajout photo";
    buttonAction.classList.add("visibility-hidden");
    trait.classList.add("visibility-hidden");
    const inputCategorie = document.getElementById("categorie-select");
    const submitPhoto = document.querySelector(".submit-photo");
    submitPhoto.classList.add("background-color-submit");
    // Changer le background du button submit quand le champ categorie est focus
    function changerCouleurSubmit() {
      inputCategorie.addEventListener("focus", () => {
        submitPhoto.classList.remove("background-color-submit");
      });
    }
    changerCouleurSubmit();

    flecheRetour.addEventListener("click", () => {
      if (baliseModalGallery.children.length !== 0) {
        baliseContenuModal.innerHTML = "";
        baliseModalGallery.classList.remove("visibility-hidden");
        baliseModalGallery.innerHTML = "";
        createGalleryModal();
      }
      buttonAction.classList.remove("visibility-hidden");
      buttonAction.innerHTML = "Ajouter une photo";
      titreModal.innerHTML = "Galerie photo";
      flecheRetour.classList.add("visibility-hidden");
      trait.classList.remove("visibility-hidden");
    });

    getCategories().then((categories) => {
      if (token.length !== 0) {
        generateCategorieInHTML(categories);
      }
      telechargerNouveauProjet();
    });
  });
}
function telechargerNouveauProjet() {
  const fileInput = document.getElementById("file");
  const nouveauProjet = document.getElementById("nouveau-projet");
  const svgDeTelechargement = document.querySelector(
    ".contenu-ajout-photo svg"
  );
  const labelAjouterPhoto = document.querySelector(
    ".contenu-ajout-photo label"
  );
  const paragrapheAjoutPhoto = document.querySelector(".contenu-ajout-photo p");

  // Affichage de l'image quand le fichier est sélectionné
  fileInput.addEventListener("change", (event) => {
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        nouveauProjet.src = e.target.result;
        svgDeTelechargement.classList.add("display-none");
        nouveauProjet.style.display = "block";
        labelAjouterPhoto.style.display = "none";
        paragrapheAjoutPhoto.style.display = "none";
      };
      // Lire le fichier et générer une URL
      reader.readAsDataURL(file);
    }
  });

  function createNouveauProjet() {
    const formAjoutPhoto = document.querySelector(".form-ajout-photo");

    formAjoutPhoto.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();

      // Récupérer les valeurs du formulaire
      const titre = document.getElementById("titre");
      const categorie = document.getElementById("categorie-select");
      const fileInput = document.getElementById("file");

      // Vérifier la présence des champs
      if (!fileInput || !titre || !categorie) {
        console.log("Tous les champs sont requis");
        return;
      }

      // Ajouter les champs au FormData
      formData.append("image", fileInput.files[0]);
      formData.append("title", titre.value);
      formData.append("category", categorie.value);

      // Vérifier ce qui est ajouté à formData
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Ajouter le token d'authentification et envoyer la requête à l'API
      const token = localStorage.getItem("token");
      console.log(token);
      fetch(api + "works", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'envoi : " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Réponse du serveur:", data);
          getProjects().then((projects) => {
            createGallery(projects);
            quitterModal();
          });
        })

        .catch((error) => {
          console.error("Erreur lors de l'envoi du formulaire:", error);
        });
    });
  }

  createNouveauProjet();
}

// generer les option categorie dans la modal
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
