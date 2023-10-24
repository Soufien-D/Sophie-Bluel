/****PROJETS****/

// Appel API, creation des galeries et ajout d'un nouveau projet
async function showProjects() {
  const response = await fetch("http://localhost:5678/api/works");

  const works = await response.json();

  createProject(works); // Galerie de la page d'acceuil
  createSmallGallery(works); // Galerie de la premiere modal
  addProject(works); // Ajout d'un projet dans la deuxieme modal
}

showProjects();

// Creation d'un projet
function createProject(works) {
  for (let i = 0; i < works.length; i++) {
    const gallery = document.querySelector(".gallery");
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    figure.id = works[i].id;
    figure.dataset.category = works[i].category.name;
    image.src = works[i].imageUrl;
    figcaption.innerText = works[i].title;

    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(figcaption);
  }
}

/****FILTRES****/

// Appel API et creation des balises filtres
async function creationFiltres() {
  const response = await fetch("http://localhost:5678/api/categories");
  const category = await response.json();

  filtersName(category); // Creation des filtres avec noms
  applyFilter(category); // Filtrage des images
  choixCategoryModal(category); // Mise en place des categories dans la deuxieme modal
}

creationFiltres();

function filtersName(category) {
  for (let i = 0; i <= category.length; i++) {
    const button = document.createElement("button");
    button.classList.add("button");
    const filter = document.querySelector(".filter");
    filter.classList.add("filter");

    filter.appendChild(button);

    // Ajout du nom dans chaque boutton de filtre
    i == 0 ? (button.innerText = "Tous") : (button.innerText = category[i - 1].name);
  }
}

// Ajout de l'EventListener aux boutons de filtre pour le filtrage
function applyFilter() {
  const buttons = document.querySelectorAll(".button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((button) => {
        button.classList.remove("selected"); // Supprime la couleur verte des boutons
      });

      // Affiche ou cache les projets en fonction de la categorie
      const nomDuFiltre = button.innerText;
      const figures = document.querySelectorAll(".gallery figure");

      figures.forEach((figure) => {
        const category = figure.dataset.category;

        if (nomDuFiltre === "Tous" || nomDuFiltre === category) {
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
        }
      });

      button.classList.add("selected"); // Ajoute la couleur verte aux boutons
    });
  });
}

/****MODE EDITION****/

// Affiche le mode edition aprés la connexion
if (localStorage.getItem("token")) {
  document.querySelector(".edition_mod").style.display = "flex";
  document.getElementById("login_button").style.display = "none";
  document.getElementById("logout_button").style.display = "flex";
  document.querySelector(".open_modal").style.display = "flex";
  document.querySelector(".filter").style.display = "none";
}

// Affiche la page d'accueil apres logout
logout_button.addEventListener("click", function () {
  localStorage.removeItem("token"); // Supprime le token du local storage
});

/****MODAL****/

// Ouverture de la premiere modal
const openModal = document.querySelector(".open_modal");

openModal.addEventListener("click", function () {
  document.getElementById("modal_one").style.display = "flex";
});

// Fermuture de la premiere modal
const closeModal = document.querySelector(".close_modal .cross");

closeModal.addEventListener("click", () => {
  document.getElementById("modal_one").style.display = "none";
});

const modalOne = document.getElementById("modal_one");

modalOne.addEventListener("click", function (event) {
  if (event.target === modalOne) {
    modalOne.style.display = "none";
  }
});

// Creation de la galerie dans la modal
function createSmallGallery(works) {
  const smallGallery = document.querySelector(".small_gallery");

  for (let i = 0; i < works.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    const image = document.createElement("img");
    image.src = works[i].imageUrl;

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can", "fa-xs");

    card.id = works[i].id;
    card.dataset.category = works[i].category.name;

    smallGallery.appendChild(card);
    card.appendChild(image);
    card.appendChild(trash);

    // Supprimer une image de la modal
    trash.addEventListener("click", async function () {
      let token = localStorage.getItem("token");
      const idImage = works[i].id;

      await fetch("http://localhost:5678/api/works" + "/" + idImage, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        if (response.ok) {
          console.log("projet supprimé");

          const removeCard = document.getElementById(`${idImage}`);
          removeCard.remove();
          const removeFigure = document.getElementById(`${idImage}`);
          removeFigure.remove();
        }
      });
    });
  }
}

// Ouverture de la deuxieme modal
const openModaltwo = document.querySelector(".open_modal_two");

openModaltwo.addEventListener("click", function () {
  document.getElementById("modal_one").style.display = "none";
  document.getElementById("modal_two").style.display = "flex";
});

// Retour a la premiere modal
const returnModaltwo = document.querySelector(".fa-arrow-left");

returnModaltwo.addEventListener("click", function () {
  document.getElementById("modal_one").style.display = "flex";
  document.getElementById("modal_two").style.display = "none";
  const ifError = document.querySelector(".if_error");
  ifError.style.display = "none"; // Efface le message pour qu'il ne reste pas affiche
});

// Fermeture de la deuxieme modal
const closeModaltwo = document.querySelector(".close_modal_two .cross");

closeModaltwo.addEventListener("click", () => {
  document.getElementById("modal_two").style.display = "none";
  const ifError = document.querySelector(".if_error");
  ifError.style.display = "none"; // Efface le message pour qu'il ne reste pas affiche
});

const modaltwo = document.getElementById("modal_two");

modaltwo.addEventListener("click", function (event) {
  if (event.target === modaltwo) {
    modaltwo.style.display = "none";
    const ifError = document.querySelector(".if_error");
    ifError.style.display = "none"; // Efface le message pour qu'il ne reste pas affiche
  }
});

// Upload de l'image dans la deuxieme modal
const icon = document.querySelector(".fa-image");
const form = document.querySelector(".add_info");
const buttonAddPhoto = document.querySelector(".upload");
const conditions = document.getElementById("format");
const img = document.getElementById("preview");

form.addEventListener("change", function (event) {
  event.preventDefault();

  const file = document.getElementById("upload").files[0];

  if (file) {
    const reader = new FileReader(); // Créez un objet FileReader pour lire le contenu du fichier et l'insérer dans une balise img

    // Chargement du fichier
    reader.onload = function (event) {
      img.src = event.target.result;
      img.style.display = "flex";

      icon.style.display = "none";
      buttonAddPhoto.style.display = "none";
      conditions.style.display = "none";
    };

    // Lecture du fichier
    reader.readAsDataURL(file);
  }
});

// Ajout et choix des categories dans la deuxieme modal
function choixCategoryModal(category) {
  for (let i = 0; i < category.length; i++) {
    const option = document.createElement("option");
    const select = document.getElementById("categorie");
    option.innerText = category[i].name;
    option.setAttribute("value", category[i].id);
    select.appendChild(option);
  }
}

// CREATION ET ENVOI DU NOUVEAU PROJET

function addProject(works) {
  let i = works.length;

  const validation = document.querySelector(".valid");
  let token = localStorage.getItem("token");

  validation.addEventListener("click", async function (event) {
    event.preventDefault();

    const works = JSON.parse(localStorage.getItem("worksData"));

    // récupération des valeurs du formulaire
    const file = document.getElementById("upload").files[0];
    console.log(file);
    const title = document.getElementById("titre").value;
    console.log(title);
    const category = document.getElementById("categorie").value;
    console.log(category);

    // Validation des données du formulaire
    if (!file || !title || !category) {
      const ifError = document.querySelector(".if_error");
      ifError.style.display = "flex";

      return;
    }

    let formData = new FormData();

    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);
    console.log(formData);

    await fetch("http://localhost:5678/api/works/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: formData,
    }).then((response) => {
      if (response.status) {
        // Si le statut de la reponse est OK
        console.log("Nouveau projet ajoute a la gallerie");
        document.getElementById("modal_two").style.display = "none";

        const ifError = document.querySelector(".if_error");
        ifError.style.display = "none";

        document.querySelector(".add_info").reset();

        const icon = document.querySelector(".fa-image");
        icon.style.display = "flex";
        const buttonAddPhoto = document.querySelector(".upload");
        buttonAddPhoto.style.display = "flex";
        const conditions = document.getElementById("format");
        conditions.style.display = "flex";
        const img = document.getElementById("preview");
        img.src = "";
        img.style.display = "none";

        fetch("http://localhost:5678/api/works")
          .then((response) => response.json())
          .then((newWorks) => {
            // Ajout du nouveau projet aux galeries
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            createProject(newWorks);

            const smallGallery = document.querySelector(".small_gallery");
            smallGallery.innerHTML = "";
            createsmallGallery(newWorks);
          });
      }
    });
  });
}
