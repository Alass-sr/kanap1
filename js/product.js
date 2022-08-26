let str = window.location.href;
let url = new URL(str);

let article_url = window.location.search;
let urlParams = new URLSearchParams(article_url);
let productId = urlParams.get("id");
// let article = "";



// Insertion des options de couleurs
function setColors(colors) {
  for (let color of colors) {
    let select = document.getElementById("colors");
    let option = document.createElement("option");

    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  }
}

// Insertion des produits
function choiceProd(article) {
  let item = document.querySelector(".item");

  // Insertion des images
  let itemImg = item.querySelector(".item__img");
  let image = document.createElement("img");
  image.src = article.imageUrl;
  image.alt = article.altTxt;

  // Modification Titre
  let productName = item.querySelector("#title");
  productName.textContent = article.name;

  // Modification Price
  let prodPrice = item.querySelector("#price");
  prodPrice.textContent = article.price;

  // Modification Description
  let prodDescription = item.querySelector("#description");
  prodDescription.textContent = article.description;

  setColors(article.colors);

  itemImg.appendChild(image);
}

// choiceProd();


// recupération de l'API
async function getProducts(article) {
  let id = new URL(window.location).searchParams.get("id");

  await fetch("http://localhost:3000/api/products/" + productId)
    .then((response) => response.json())
    .then((data) => {
      //  console.log(data);

      choiceProd(data);
    });
}

getProducts();

const qty = document.querySelector("#quantity");

const color = document.querySelector("#colors");

//Envoi des informations client au localstorage
// Gestion du panier
function addToCart(article) {
  const addToCartBtn = document.querySelector("#addToCart");

  // Ecoute l'évenement
  addToCartBtn.addEventListener("click", (event) => {
    if (qty.value > 0 && qty.value <= 100 && qty.value != 0) {
      // Récupération choix de couleur et quantité
      let choiceColor = color.value;

      let choiceQuantity = qty.value;

      // Récupération des options d'article à ajouter dans le local storage
      let choiceArticle = {
        choixId: productId,
        choixCouleur: choiceColor,
        choiceQty: parseInt(choiceQuantity),
      };

      // Récup le local storage
      let productLocalStorage = JSON.parse(localStorage.getItem("panier"));

      
      
      // Vérification
      if (productLocalStorage == null) {
        productLocalStorage = [];
      }
      // Recherche ligne ayant meme Id meme Color
      const productFind = productLocalStorage.find(
        (el) => el.choixId === productId && el.choixCouleur === choiceColor
        );
        
        // pop-up
      if (
        window.confirm(
          `Votre commande de ${choiceQuantity} ${choiceColor} est ajoutée au panier pour consulter votre panier, cliquez sur OK`
        )
      ) {
        if (productFind) {
          // Si le produit est trouver on ajout le produit
          productFind.choiceQty = parseInt(productFind.choiceQty) + parseInt(choiceQuantity);

          // On ajout au panier et on le converti
          localStorage.setItem("panier", JSON.stringify(productLocalStorage));
        } else {
          productLocalStorage.push(choiceArticle);
          localStorage.setItem("panier", JSON.stringify(productLocalStorage));
        }
        window.location.href = "cart.html";
      }
    } else {
      alert("veuillez saisir");
    }
  });
}
addToCart();