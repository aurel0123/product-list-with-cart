let list_data = [];
let count = 0;
let newArray = [];
let total = document.querySelector(".total");
total.textContent = " ";
let order_total = document.querySelector(".btn-and-totalprice");
let totalePrice = 0;
let total_order = document.querySelector(".total_order"); 
total_order.textContent = " "; 
let panier = document.querySelector(".panier");


/* récupération des catégories */
function recupdata() {
  fetch("data.json")
    .then((res) => res.json())
    .then((result) => {
      list_data = result;
      console.log(list_data);
      creatProdct();
    });
}
recupdata();

function creatProdct() {
  let cards = document.querySelector(".cards");
  cards.innerHTML = "";
  if (list_data.length > 1) {
    list_data.forEach((product, index) => {
      let Product = `
                <div class="card">
                    <img src=${product.image.desktop} alt="">
                    <div class="btn-content">
                    <button class="btn_add_card" onclick="add_produit(${index})"><i class="fa-solid fa-cart-shopping" ></i>Add to Cart</button>
                    <div class="quantity_btn">
                        <i class="fa-solid fa-minus minus"></i> 
                        <span class="quantity">1</span>
                        <i class="fa-solid fa-plus plus"></i>
                    </div>
                    </div>
                    <div class="details">
                    <p class="category">${product.category}</p>
                    <h3 class="food">${product.name}</h3>
                    <h2 class="price">${product.price}$</h2>
                    </div>
                </div>
            `;
      cards.insertAdjacentHTML("beforeend", Product);
    });

    // Ajouter les écouteurs d'événements après avoir généré les éléments
  }
}

function add_produit(index) {
  let btn_content = document.querySelectorAll(".btn-content");
  let btn1 = btn_content[index];

  document.querySelector(".items-card").style.display = "none";

  order_total.style.display = "block";
  if (btn1) {
    let quantity_btn = btn1.querySelector(".quantity_btn");
    let btn1_add = btn1.querySelector(".btn_add_card");
    quantity_btn.style.display = "flex";
    btn1_add.style.display = "none";

    count++;
    document.querySelector(".quantity_value").innerHTML = count;

    
    panier.style.display = "flex";

    let quantity = btn1.querySelector(".quantity");
    let num_quantity = parseInt(quantity.textContent);

    // Ajouter le produit au panier si ce n'est pas déjà fait
    if (!newArray[index]) {
      newArray[index] = { ...list_data[index], quantity: 1 };
    }

    // Mettre à jour le panier
    updatePanier();

    // Gestion de l'augmentation et de la diminution de la quantité
    btn1.querySelector(".plus").onclick = () => {
      newArray[index].quantity++;
      quantity.textContent = newArray[index].quantity;
      updatePanier();
    };

    btn1.querySelector(".minus").onclick = () => {
      if (newArray[index].quantity > 1) {
        newArray[index].quantity--;
        quantity.textContent = newArray[index].quantity;
        updatePanier();
      } else {
        newArray[index].quantity = 0;
        btn1.querySelector(".btn_add_card").style.display = "flex";
        btn1.querySelector(".quantity_btn").style.display = "none";
        count--;
        document.querySelector(".quantity_value").innerHTML = count;
        updatePanier();
        document.querySelector(".items-card").style.display = "flex";
      }
    };
  }
}

function updatePanier() {
  let panier = document.querySelector(".panier");
  panier.innerHTML = ""; // Réinitialise le contenu du panier
  let totalePrice = 0;
  newArray.forEach((product, idx) => {
    if (product.quantity > 0) {
      let ListProduct = `
                <div class="card_shop">
                    <div class="shop">
                        <h4>${product.name}</h4>
                        <p>
                            <span class="number_add">${product.quantity}x</span>
                            <span class="price">${product.price}$</span>
                            <span class="total-price">${
                              product.quantity * product.price
                            }$</span>
                        </p>
                    </div>
                    <button class="btn_remove" onclick="remove_product(${idx})">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <hr>
                
            `;
      panier.insertAdjacentHTML("beforeend", ListProduct);

      totalePrice += product.price * product.quantity;
      total.textContent = totalePrice + "$";
    }
  });
}

function remove_product(index) {
  newArray[index].quantity = 0;
  count--;
   
  updatePanier();
  document.querySelector(".quantity_value").textContent = count;
  let cards = document.querySelectorAll(".card");
  let btn_card = cards[index];

  btn_card.querySelector(".btn_add_card").style.display = "block";
  btn_card.querySelector(".quantity_btn").style.display = "none";
  
}


let order_confirmation = document.querySelector(".order-confirm");
let body = document.querySelector("body");
let btn_confirmation = document.querySelector(".btn-confirm-order");
btn_confirmation.onclick = () => {
 
  order_confirmation.style.display = "block";
  
  body.style.backgroundColor = "#1d1c1c63";
  let details_order = document.querySelector(".details-order");
  details_order.innerHTML = ""; 
  let totalePrice = 0;
  if (newArray.length > 0) {
    newArray.forEach((product, index) => {
      let ListProduct = `
        <div class="order-infos-details">
        <div class="order">
          <div class="img-order">
            <img src=${product.image.desktop} alt="">
          </div>
          <div class="infos-order">
            <h3>${product.name}</h3>
            <p>
              <span class="number_add">${product.quantity}x</span>
              <span class="price">${product.price}$</span>
            </p>
          </div>
        </div>
        <span class="total-price">${product.price * product.quantity}$</span>
      </div>
      <hr>
      `;
      details_order.insertAdjacentHTML('beforeend', ListProduct); 
        
      totalePrice += product.price * product.quantity;
      total_order.textContent = totalePrice + "$";
               
    });
  }
};


/* start new order */
document.querySelector('.new_order').onclick = () =>{
    newArray.splice(0); 
    updatePanier(); 
    order_confirmation.style.display= "none"; 
    body.style.backgroundColor = "hsl(13, 31%, 94%)"; 
    count = 0; 
    document.querySelector(".items-card").style.display = "block";
    order_total.style.display = "none"; 
    document.querySelector(".quantity_value").innerHTML = count;
    let card = document.querySelectorAll(".card")
    card.forEach((item)=>{
        item.querySelector('.btn_add_card').style.display = "flex";
        item.querySelector('.quantity_btn').style.display = "none"
    })

}