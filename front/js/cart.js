// RECUPERER LES PRODUITS STOCKES DANS LE LOCALSTORAGE   //
let products = [];
let productInLocalStorage = JSON.parse(localStorage.getItem("product"));

// AFFICHER LES PRODUITS DU PANIER

// je sélectionne la partie html sur laquelle nous allons travailler
let cartAndFormContainer = document.getElementById("cartAndFormContainer");

// si le panier est vide : afficher 'le panier est vide'
if (productInLocalStorage === null || productInLocalStorage == 0) {
  document.querySelector("#cart__items").innerHTML = `
  <div class="cart__empty">
    <p>Votre panier est vide !</p>
  </div>`;
}
// si le panier n'est pas vide : afficher les produits qui sont dans le localStorage
else {
  let itemCards = [];

  // incrémentation
  for (i = 0; i < productInLocalStorage.length; i++) {
    products.push(productInLocalStorage[i].id);

    // le code suivant sera injecté à chaque tour de boucle
    // selon la longueur des produits dans le local storage
    itemCards =
      itemCards +
      `
    
    <article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage.color}">
    <div class="cart__item__img">
      <img src="${productInLocalStorage[i].image}" alt="${productInLocalStorage[i].alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${productInLocalStorage[i].name}</h2>
        <p>${productInLocalStorage[i].color}</p>
        <p>${productInLocalStorage[i].price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
    `;
  }
  if (i === productInLocalStorage.length) {
    const itemCart = document.getElementById("cart__items");
    itemCart.innerHTML += itemCards;
  }

  // ON MODIFIE LE PANIER : MODIF DE QUANTITE

  // modif quantité dans le panier
  function changeQtt() {
    let itemQtt = document.querySelectorAll(".itemQuantity");
    for (let j = 0; j < itemQtt.length; j++) {
      itemQtt[j].addEventListener("change", (event) => {
        event.preventDefault();

        // sélection de la nouvelle quantité, dans un nouveau tableau

        let itemNewQtt = itemQtt[j].value;
        const newLocalStorage = {
          id: productInLocalStorage[j].id,
          image: productInLocalStorage[j].image,
          alt: productInLocalStorage[j].alt,
          name: productInLocalStorage[j].name,
          color: productInLocalStorage[j].color,
          price: productInLocalStorage[j].price,
          quantity: itemNewQtt,
        };

        // actualiser le localStorage avec les nouvelles données récupérées...
        productInLocalStorage[j] = newLocalStorage;

        localStorage.setItem("product", JSON.stringify(productInLocalStorage));

        // mettre à jour total du panier
        alert("Votre panier est à jour.");
        totalArticles();
        priceAmount();
      });
    }
  }
  changeQtt();

  // ON SUPPRIME UN PRODUIT DANS LE PANIER

  // On utilise la fonction deleteArticle
  function deleteArticle() {
    const deleteItem = document.querySelectorAll(".deleteItem");

    for (let k = 0; k < deleteItem.length; k++) {
      deleteItem[k].addEventListener("click", (event) => {
        event.preventDefault();

        // enregistrer l'id et la couleur séléctionnés par le bouton supprimer
        let deleteId = productInLocalStorage[k].id;
        let deleteColor = productInLocalStorage[k].color;

        // filtrer l'élément cliqué par le bouton supprimer
        // en respectant les conditions du callback
        productInLocalStorage = productInLocalStorage.filter(
          (elt) => elt.id !== deleteId || elt.color !== deleteColor
        );

        // on envoie les nouvelles données dans le localStorage de la même manière que précédemment
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));

        // recharger la page
        window.location.href = "cart.html";
        alert("Votre article a bien été supprimé.");
      });
    }
  }
  deleteArticle();

  // AFFICHAGE DU TOTAL

  function totalArticles() {
    let totalItems = 0;
    for (l in productInLocalStorage) {
      // analyser et convertir la valeur 'quantité' dans le localstorage

      const newQuantity = parseInt(productInLocalStorage[l].quantity, 10);

      // attribuer la valeur retournée par parseInt à la variable totalItems
      totalItems += newQuantity;
    }
    // attribuer à #totalQuantité la valeur de totalItems et l'afficher dans le DOM
    const totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.textContent = totalItems;
  }
  totalArticles();

  // je calcule le montant total du panier
  function priceAmount() {
    const calculPrice = [];
    for (m = 0; m < productInLocalStorage.length; m++) {
      // le prix de l'article équivaut à quantité * prix
      const cartAmount =
        productInLocalStorage[m].price * productInLocalStorage[m].quantity;
      calculPrice.push(cartAmount);

      // la fonction reduce() permet de garder en mémoire les résultats de l'opération
      // elle fonctionne comme une boucle, avec un accumulateur et la valeur courante
      const reduce = (previousValue, currentValue) =>
        previousValue + currentValue;
      total = calculPrice.reduce(reduce);
    }
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = total;
  }
  priceAmount();
} // fin else : s'il y a des produits dans le panier

// FORMULAIRE de saisie de données du client  //

// envoi des données saisies au serveur//

function postForm() {
  const order = document.getElementById("order");
  order.addEventListener("click", (event) => {
    event.preventDefault();

    //Création d'une constante contenant l'ensemble des données du formulaire //

    const contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };

    //vérification des données saisies dans le formulaire et affichage si besoin d'un message d'erreur//

    //contrôle prénom
    function controlFirstName() {
      const validFirstName = contact.firstName;
      if (/^[a-z][a-z '-.,]{1,31}$|^$/i.test(validFirstName)) {
        return true;
      } else {
        let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
        firstNameErrorMsg.innerText =
          "Merci de vérifier le prénom, 3 caractères minimum";
      }
    }

    // contrôle nom
    function controlName() {
      const validName = contact.lastName;
      if (/^[a-z][a-z '-.,]{1,31}$|^$/i.test(validName)) {
        return true;
      } else {
        let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
        lastNameErrorMsg.innerText =
          "Merci de vérifier le nom, 3 caractères minimum, avec des lettres uniquement";
      }
    }

    // contrôle ville
    function controlCity() {
      const validAddress = contact.city;
      if (/^[a-z][a-z '-.,]{1,31}$|^$/i.test(validAddress)) {
        return true;
      } else {
        let cityErrorMsg = document.getElementById("cityErrorMsg");
        cityErrorMsg.innerText =
          "Merci de vérifier le nom de la ville, 3 caractères minimum, avec des lettres uniquement";
      }
    }

    function controlEmail() {
      const validEmail = contact.email;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        return true;
      } else {
        let emailErrorMsg = document.getElementById("emailErrorMsg");
        emailErrorMsg.innerText = "Erreur ! Email non valide";
      }
    }

    // Après vérification des entrées, j'envoie l'objet contact dans le localStorage
    function validControl() {
      if (
        controlFirstName() &&
        controlName() &&
        controlCity() &&
        controlEmail()
      ) {
        localStorage.setItem("contact", JSON.stringify(contact));
        return true;
      } else {
        alert("Merci de vérifir les données saisies");
      }
    }
    validControl();

    //création d'un objet qui contient les données de contact et les produits du panier//

    const sendFormData = {
      products,
      contact,
    };

    //envoyer l'object comprenant les données de contact  et les produits du panier vers le serveur avec la méthode POST //

    const options = {
      method: "POST",
      body: JSON.stringify(sendFormData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("orderId", data.orderId);
        if (validControl()) {
          document.location.href = "confirmation.html?id=" + data.orderId;
        }
      });
  }); // fin eventListener postForm
} // fin envoi du formulaire postForm
postForm();
