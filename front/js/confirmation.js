// fonction qui va permettre l'affichage de l'ID dans la page et supprimer le contenu du panier
function checkOut() {
  let orderId = window.location.search.split("=")[1];
  document.getElementById("orderId").innerHTML = orderId;
  localStorage.removeItem("cart");
}
checkOut();
