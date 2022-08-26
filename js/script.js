// Création des élèments
function setCanap(kanap) {
    let newLink = document.createElement("a");
    newLink.href = `./product.html?id=${kanap._id}` 
  
    let newArticle = document.createElement("article");
    let newImg = document.createElement("img");
    newImg.src = kanap.imageUrl;
    newImg.alt = kanap.altTxt;
  
    let newH3 = document.createElement("h3");
    newH3.className = "productName";
    newH3.textContent = kanap.name;
    
  
    let newP = document.createElement("p");
    newP.className = "productDescription";
    newP.textContent = kanap.description;
  
    // liaisons des éléments.
  
    newLink.appendChild(newArticle);
    newArticle.appendChild(newImg);
    newArticle.appendChild(newH3);
    newArticle.appendChild(newP);
  
    return newLink;
  }
  
  // insertion de l'API
  async function getProducts() {
    await fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
  
        let sectionProduits = document.getElementById("items");
        for (let kanap of data) {
          let myLink = setCanap(kanap);
          sectionProduits.appendChild(myLink);
        }
      });
  }
  
  getProducts();