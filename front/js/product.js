// grâce à la fonction searchParams on va récupérer l'ID de chaque produit

let params = new URL(window.location.href).searchParams;
let newID = params.get("id");

//sélection des éléments sur lesquels on intervient avec getElementById
const image = document.getElementsByClassName("item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");

let imageURL = "";
let imageAlt = "";

// création d'une URL pour chaque produit sélectionné grâce à l'ID récupéré
fetch("http://localhost:3000/api/products/" + newID)
  .then((res) => res.json())
  .then((data) => {
    // je modifie le contenu de chaque variable avec les bonnes données :
    image[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    imageURL = data.imageUrl;
    imageAlt = data.altTxt;
    title.innerHTML = `<h1>${data.name}</h1>`;
    price.innerText = `${data.price}`;
    description.innerText = `${data.description}`;

    // choix des couleurs
    for (number in data.colors) {
      colors.options[colors.options.length] = new Option(
        data.colors[number],
        data.colors[number]
      );
    }
  })
  //  le serveur ne répond pas
  .catch((_error) => {
    alert(" Le serveur ne répond pas");
  });

// récupération des données suite au choix du client

const selectQuantity = document.getElementById("quantity");
const selectColors = document.getElementById("colors");

// eventListener lorsque client ajoute un article au panier
const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", (event) => {
  event.preventDefault();

  const selection = {
    id: newID,
    image: imageURL,
    alt: imageAlt,
    name: title.textContent,
    price: price.textContent,
    color: selectColors.value,
    quantity: selectQuantity.value,
  };

  let productInLocalStorage = JSON.parse(localStorage.getItem("product"));

  // ajout des produits sélectionnés dans le localStorage
  const addProductLocalStorage = () => {
    // récupération de la sélection de l'utilisateur dans le tableau de l'objet :

    productInLocalStorage.push(selection);
    // stockage des données dans le local storage,
    // avec la fonction setItem(clé,valeur) on enregistre les valeurs dans le local storage
    localStorage.setItem("product", JSON.stringify(productInLocalStorage));
  };

  //  message qui indique que le produit est ajouté au panier
  let addConfirm = () => {
    alert("Le produit a bien été ajouté au panier");
  };

  let update = false;

  // s'il y a des produits enregistrés dans le localStorage
  if (productInLocalStorage) {
    // verifier que le produit ne soit pas deja dans le localstorage/panier
    // avec la couleur
    productInLocalStorage.forEach(function (productOk, key) {
      if (productOk.id == newID && productOk.color == selectColors.value) {
        productInLocalStorage[key].quantity =
          parseInt(productOk.quantity) + parseInt(selectQuantity.value);
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));
        update = true;
        addConfirm();
      }
    });

    //
    if (!update) {
      addProductLocalStorage();
      addConfirm();
    }
  }

  // s'il n'y a aucun produit enregistré dans le localStorage
  else {
    // tableau avec les produits choisis par l'utilisateur
    productInLocalStorage = [];
    addProductLocalStorage();
    addConfirm();
  }
});

// fin product.js
