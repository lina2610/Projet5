// fetch pour récupérer les canapés et les afficher sur la page d'accueil

let articleFetch = function () {
  fetch("http://localhost:3000/api/products")
    //promesse n°1 qui va récupérer la réponse et la transformer en .JSON pour faciliter la lecture par navigateur
    .then((response) => response.json())

    // promesse n°2 qui va afficher les données obtenues précédemment
    .then((data) => {
      console.log(data);

      // dans un second temps on affiche sur la page les canapés que l'on a récupéré avec l'id contenu dans le code HTML
      // on sélectionne avec getelementbyId l'élément sur lequel on travaille
      let itemSection = document.getElementById("items");

      // utilisation de for : ajout des canapés tant qu'il y en a
      for (i = 0; i < data.length; i++) {
        const itemCard = `
          <a href="./product.html?id=${data[i]._id}">
            <article>
              <img
                src="${data[i].imageUrl}"
                alt="${data[i].altTxt}"
              />
              <h3 class="productName">${data[i].name}</h3>
              <p class="productDescription">
                ${data[i].description}
              </p>
            </article>
          </a>
        `;
        itemSection.innerHTML += itemCard;
      }
    });
};
articleFetch(); // fin du fetch
