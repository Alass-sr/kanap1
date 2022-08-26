//Initilaisation Local Storage
let productLocalStorage = JSON.parse(localStorage.getItem("panier"));
console.log(productLocalStorage);

// const choiceBasket = document.querySelector("#cart__items");

function createCartElement(index, product) {
  let articleProduct = document.createElement("article");
  articleProduct.className = "cart__item";
  articleProduct.setAttribute("data-id", productLocalStorage[index].choixId);
  articleProduct.setAttribute(
    "data-color",
    productLocalStorage[index].choixCouleur
  );
  document.querySelector("#cart__items").appendChild(articleProduct);
  // console.log(articleProduct);

  // Insertion de la "DIV"

  let divProduct = document.createElement("div");
  divProduct.className = "cart__item__img";
  articleProduct.appendChild(divProduct);

  let imgProduct = document.createElement("img");
  imgProduct.src = product.imageUrl;
  imgProduct.alt = product.altTxt;
  divProduct.appendChild(imgProduct);

  let prodItemContent = document.createElement("div");
  prodItemContent.className = "cart__item__content";
  articleProduct.appendChild(prodItemContent);

  let prodItemContentDescript = document.createElement("div");
  prodItemContentDescript.className = "cart__item__content__description";
  prodItemContent.appendChild(prodItemContentDescript);

  let titleProd = document.createElement("h2");
  titleProd.className = "cart__item__content__description";
  titleProd.textContent = product.name;
  prodItemContentDescript.appendChild(titleProd);

  let colorProd = document.createElement("p");
  colorProd.textContent = productLocalStorage[index].choixCouleur;
  colorProd.className = "cart__item__content__description";
  prodItemContentDescript.appendChild(colorProd);

  let priceProd = document.createElement("p");
  priceProd.className = "cart__item__content__description";
  priceProd.textContent = product.price + "€";
  prodItemContentDescript.appendChild(priceProd);

  let cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.className = "cart__item__content__settings";
  prodItemContent.appendChild(cartItemContentSettings);

  let cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.className =
    "cart__item__content__settings__quantity";
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

  let qtyProd = document.createElement("p");
  // qtyProd.textContent = productLocalStorage[index].choiceQty;
  cartItemContentSettingsQuantity.appendChild(qtyProd);
  qtyProd.textContent = "Qté : ";

  // Insertion quantity
  let productQuantity = document.createElement("input");
  productQuantity.className = "itemQuantity";
  productQuantity.value = productLocalStorage[index].choiceQty;
  productQuantity.setAttribute("type", "number");
  productQuantity.setAttribute("min", "1");
  productQuantity.setAttribute("max", "100");
  productQuantity.setAttribute("name", "itemQuantity");
  cartItemContentSettingsQuantity.appendChild(productQuantity);
  productQuantity.addEventListener("change", (e) => {

    e.preventDefault();

    let article = e.target.closest("article");
        
    let changeId = article.getAttribute("data-id");
    let changeColor = article.getAttribute("data-color");

    // filter l'element 
    indexArticle = productLocalStorage.findIndex(
      (elt) => elt.choixId == changeId && elt.choixCouleur == changeColor
    );

    productLocalStorage[indexArticle].choiceQty=e.target.value;


    // Envoi les données dans le localstorage
    localStorage.setItem("panier", JSON.stringify(productLocalStorage));

    getTotal();
  })

  let cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettingsDelete.className =
    "cart__item__content__settings__delete";
  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

  let supprimeProd = document.createElement("p");
  supprimeProd.className = "deleteItem";
  cartItemContentSettingsDelete.appendChild(supprimeProd);
  supprimeProd.textContent = "Supprimer";
  supprimeProd.addEventListener("click", (e) => {
    e.preventDefault();

    let article = e.target.closest("article");

    // enregistrer l'id et la couleur séléctionnés par le bouton supprimer
    
    // let supprimeId = productLocalStorage[index].choixId;
    // let supprimeColor = productLocalStorage[index].choixCouleur;
    let supprimeId = article.getAttribute("data-id");
    let supprimeColor = article.getAttribute("data-color");

    // filter l'element à supprimer
    productLocalStorage = productLocalStorage.filter(
      (elt) => elt.choixId !== supprimeId || elt.choixCouleur !== supprimeColor
    );

    // Envoi les données dans le localstorage
    localStorage.setItem("panier", JSON.stringify(productLocalStorage));

    // Alert de la suppression de l'article
    alert("Votre article a bien été supprimé.");

    if (productLocalStorage.length === 0) {
      localStorage.clear();
    }
    getTotal();
    // location.reload();
    article.remove();
  });
  // console.log(supprimeProd)
}

async function getCart() {
  // Vérification si panier vide
  if (productLocalStorage === null || productLocalStorage == 0) {
    alert("panier vide !");
  } else {
    for (let panierProduct in productLocalStorage) {
      let productId = productLocalStorage[panierProduct].choixId;

      await fetch("http://localhost:3000/api/products/" + productId)
        .then((response) => response.json())
        .then((data) => {
          createCartElement(panierProduct, data);

        });
    }
  }
}
getCart();

async function getProd(pId) {
  return await fetch(`http://localhost:3000/api/products/${pId}`)
    .then((response) => response.json())
    .then((data) => {
      //  console.log(data);
      return data;
    });
}

async function getTotal() {


  let totalQty = 0;

  let priceTotal = 0;

  for (let product of productLocalStorage) {
    // console.log(product);

    let prodFromBackEnd = await getProd(product.choixId);
    // console.log(prodFromBackEnd);

    totalQty += parseInt (product.choiceQty);

    priceTotal += prodFromBackEnd.price * product.choiceQty;
  }

  let displayTotalQuantity = document.getElementById("totalQuantity");
  displayTotalQuantity.textContent = totalQty;
  // console.log(displayTotalQuantity);

  let displayTotalPrice = document.getElementById("totalPrice");
  displayTotalPrice.textContent = priceTotal;
  // console.log(displayTotalPrice);

}
getTotal();

// Formulaire

//Instauration formulaire avec regex
function getForm() {
  let cartOrderForm = document.querySelector(".cart__order__form");

  //Création des expressions régulières
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );

  // Ecoute des "event"
  cartOrderForm.firstName.addEventListener("input", function () {
    validFirstName(this);
  });

  cartOrderForm.lastName.addEventListener("input", function () {
    validLastName(this);
  });

  cartOrderForm.address.addEventListener("input", function () {
    validAddress(this);
  });

  cartOrderForm.city.addEventListener("input", function () {
    validCity(this);
  });

  cartOrderForm.email.addEventListener("input", function () {
    validEmail(this);
  });

  // Validation
  const validFirstName = function (inputFirstName) {
    let firstNameErrorMsg = inputFirstName.nextElementSibling;

    if (charRegExp.test(inputFirstName.value)) {
      firstNameErrorMsg.innerText = "";
    } else {
      firstNameErrorMsg.innerText = "Entrez votre prénom valide sans chiffre.";
    }
  };

  const validLastName = function (inputLastName) {
    let lastNameErrorMsg = inputLastName.nextElementSibling;

    if (charRegExp.test(inputLastName.value)) {
      lastNameErrorMsg.innerText = "";
    } else {
      lastNameErrorMsg.innerText = "Entrez votre nom valide sans chiffre.";
    }
  };

  const validAddress = function (inputAddress) {
    let addressErrorMsg = inputAddress.nextElementSibling;

    if (addressRegExp.test(inputAddress.value)) {
      addressErrorMsg.innerText = "";
    } else {
      addressErrorMsg.innerText = "Entrez votre adresse valide";
    }
  };

  const validCity = function (inputCity) {
    let cityErrorMsg = inputCity.nextElementSibling;

    if (charRegExp.test(inputCity.value)) {
      cityErrorMsg.innerText = "";
    } else {
      cityErrorMsg.innerText = "Entrez une ville valide sans chiffre.";
    }
  };

  const validEmail = function (inputEmail) {
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value)) {
      emailErrorMsg.innerText = "";
    } else {
      emailErrorMsg.innerText = "Entrez une adresse e-mail valide.";
    }
    console.log(emailErrorMsg);
  };
}
getForm();

// envoi des informations
 async function postForm() {
  const form = document.querySelector(".cart__order__form");

  // Ecouter les "event"
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    //Récupération des données du formulaire client
    let inputFirstName = document.getElementById("firstName");
    let inputLastName = document.getElementById("lastName");
    let inputAddress = document.getElementById("address");
    let inputCity = document.getElementById("city");
    let inputEmail = document.getElementById("email");

    //Création d'un tableau
    
    let idProd = [];
    for (let i = 0; i < productLocalStorage.length; i++) {
      idProd.push(productLocalStorage[i].choixId);
    }
    // console.log(idProd);
    

    const order = {
      contact: {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value,
      },
      products: idProd,
    };
    // console.log(order);

    const options = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    // console.log(options);

    const urlOrder = "http://localhost:3000/api/products/order";
    fetch(urlOrder, options)
      .then((response) => response.json())
      .then((data) => {

        alert(JSON.stringify(data));
        
        // localStorage.clear();
        

        window.location.href = `confirmation.html?order=${data.orderId}`;
          

      }).catch(function (error) {
        alert(`fetch failure : ${error}`)
      });
      

  });
}
postForm();