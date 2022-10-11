fetch("http://localhost:3000/api/products/")
  .then((response) => response.json())
  .then((productsFromApi) => {
    console.log(productsFromApi);

    function getPriceById(id) {
      const productById = productsFromApi.filter(function (product) {
        if (id == product._id) {
          return true;
        } else {
          return false;
        }
      });
      //console.log(productById);
      //console.log(productById[0]);
      //console.log(productById[0].price);

      return productById[0].price;
    }

    getPriceById("107fb5b75607497b96722bda5b504926");

    var price = getPriceById("107fb5b75607497b96722bda5b504926");
    console.log(price);

    // RECUPERER LES PRODUITS STOCKES DANS LE LOCALSTORAGE   //
    let products = [];
    let productInLocalStorage = JSON.parse(localStorage.getItem("product"));

    // AFFICHER LES PRODUITS DU PANIER

    // je sélectionne la partie html concernée par la modification
    let cartAndFormContainer = document.getElementById("cartAndFormContainer");

    // si le panier est vide : afficher 'le panier est vide'
    if (productInLocalStorage === null || productInLocalStorage == 0) {
      document.querySelector("#cart__items").innerHTML = `
  <div class="cart__empty">
    <p>Votre panier est vide ! <br> Merci de sélectionner des produits depuis la page d'accueil</p>
  </div>`;
    }
    // si le panier n'est pas vide : afficher les produits dans le localStorage
    else {
      let itemCards = [];

      //incrémentation
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

      // modification de la quantité dans le panier
      function changeQtt() {
        let itemQtt = document.querySelectorAll(".itemQuantity");
        for (let j = 0; j < itemQtt.length; j++) {
          itemQtt[j].addEventListener("change", (event) => {
            event.preventDefault();
            // sélection de la nouvelle quantité...
            // ... qu'on va sauvegarder dans un nouveau tableau
            // avec les autres éléments du localStorage
            let itemNewQtt = itemQtt[j].value;
            const newLocalStorage = {
              id: productInLocalStorage[j].id,
              image: productInLocalStorage[j].image,
              alt: productInLocalStorage[j].alt,
              name: productInLocalStorage[j].name,
              color: productInLocalStorage[j].color,
              price: getPriceById(productInLocalStorage[j].id),
              //productInLocalStorage[j].price,
              quantity: itemNewQtt,
            };

            // actualiser le localStorage avec les nouvelles données récupérées...

            productInLocalStorage[j] = newLocalStorage;

            localStorage.setItem(
              "product",
              JSON.stringify(productInLocalStorage)
            );

            // avertir de la modification et mettre à jour les totaux
            alert("Votre panier est à jour.");
            totalArticles();
            priceAmount();
          });
        }
      }
      changeQtt();

      // supprime un produit dans le panier
      function deleteArticle() {
        const deleteItem = document.querySelectorAll(".deleteItem");

        for (let k = 0; k < deleteItem.length; k++) {
          deleteItem[k].addEventListener("click", (event) => {
            event.preventDefault();

            // enregistrer l'id et la couleur séléctionnés par le bouton supprimer
            let deleteId = productInLocalStorage[k].id;
            let deleteColor = productInLocalStorage[k].color;

            // filtrer l'élément cliqué par le bouton supprimer

            productInLocalStorage = productInLocalStorage.filter(
              (elt) => elt.id !== deleteId || elt.color !== deleteColor
            );

            // envoyer les nouvelles données dans le localStorage
            localStorage.setItem(
              "product",
              JSON.stringify(productInLocalStorage)
            );

            // avertir de la suppression et recharger la page
            alert("Votre article a bien été supprimé.");
            window.location.href = "cart.html";
          });
        }
      }
      deleteArticle();

      // j'affiche le total des articles dans le panier
      function totalArticles() {
        let totalItems = 0;
        for (l in productInLocalStorage) {
          // analyser et convertir la valeur 'quantité' dans le localstorage en une chaîne
          const newQuantity = parseInt(productInLocalStorage[l].quantity, 10);

          // attribuer la valeur retournée par parseInt à la variable totalItems
          totalItems += newQuantity;
        }
        // attribuer à #totalQuantité la valeur de totalItems et l'afficher dans le DOM
        const totalQuantity = document.getElementById("totalQuantity");
        totalQuantity.textContent = totalItems;
      }
      totalArticles();

      // montant total du panier
      function priceAmount() {
        const calculPrice = [];
        for (m = 0; m < productInLocalStorage.length; m++) {
          // prix de l'article quantité * prix
          const cartAmount =
            //productInLocalStorage[m].price * productInLocalStorage[m].quantity;

            getPriceById(productInLocalStorage[m].price) *
            productInLocalStorage[m].quantity;
          calculPrice.push(cartAmount);

          // la fonction reduce() permet de garder en mémoire les résultats de l'opération

          const reduce = (previousValue, currentValue) =>
            previousValue + currentValue;
          total = calculPrice.reduce(reduce);
        }
        const totalPrice = document.getElementById("totalPrice");
        totalPrice.textContent = total;
      }
      priceAmount();
    } // fin else : s'il y a des produits dans le panier

    // j'envoie le formulaire dans le serveur
    function postForm() {
      const order = document.getElementById("order");
      order.addEventListener("click", (event) => {
        event.preventDefault();

        // je récupère les données du formulaire dans un objet
        const contact = {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        };

        ////
        // --- formulaire //
        ////

        //contrôle prénom
        function controlFirstName() {
          const validFirstName = contact.firstName;
          if (/^[a-zA-Zéèêëàâäîïôöûüùç\- ]{2,}$/.test(validFirstName)) {
            return true;
          } else {
            let firstNameErrorMsg =
              document.getElementById("firstNameErrorMsg");
            firstNameErrorMsg.innerText =
              "Merci de vérifier le prénom, 3 caractères minimum";
          }
        }

        // contrôle nom
        function controlName() {
          const validName = contact.lastName;
          if (/^[a-zA-Zéèêëàâäîïôöûüùç\- ]{2,}$/.test(validName)) {
            return true;
          } else {
            let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
            lastNameErrorMsg.innerText =
              "Merci de vérifier le nom, 3 caractères minimum, avec des lettres uniquement";
          }
        }

        // contrôle adresse
        function controlAddress() {
          const validAddress = contact.address;
          if (
            /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/.test(
              validAddress
            )
          ) {
            return true;
          } else {
            let addressErrorMsg = document.getElementById("addressErrorMsg");
            addressErrorMsg.innerText =
              "Merci de vérifier l'adresse, alphanumérique et sans caractères spéciaux";
          }
        }

        // contrôle ville
        function controlCity() {
          const validAddress = contact.city;
          if (
            /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,10}$/.test(validAddress)
          ) {
            return true;
          } else {
            let cityErrorMsg = document.getElementById("cityErrorMsg");
            cityErrorMsg.innerText =
              "Merci de vérifier votre saisie, 3 caractères minimum, avec des lettres uniquement";
          }
        }

        // contrôle email
        function controlEmail() {
          const validEmail = contact.email;
          if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(validEmail)
          ) {
            return true;
          } else {
            let emailErrorMsg = document.getElementById("emailErrorMsg");
            emailErrorMsg.innerText = "Email non valide";
          }
        }

        // Après vérification des entrées, j'envoie l'objet contact dans le localStorage
        function validControl() {
          if (
            controlFirstName() &&
            controlName() &&
            controlAddress() &&
            controlCity() &&
            controlEmail()
          ) {
            localStorage.setItem("contact", JSON.stringify(contact));
            return true;
          } else {
            alert("Merci de revérifier les données du formulaire");
          }
        }
        validControl();

        // je mets les valeurs du formulaire et les produits sélectionnés
        // dans un objet...
        const sendFormData = {
          contact,
          products,
        };

        // j'envoie le formulaire + localStorage (sendFormData)
        // ... que j'envoie au serveur

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

    // fin
  });
