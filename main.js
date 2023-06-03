//PRODUCTS
class Product {
    constructor (id, img, name, price, description, category, stock){
        this.id = id,
        this.img = img,
        this.name = name,
        this.price = price,
        this.description = description,
        this.category = category,
        this.stock = stock
    }   
}

const products = []
const productsContainer = document.getElementById("products-container")

async function getJSON(){
    const prod = await fetch("./json/productos.json")
    const response = await prod.json()
    response.forEach((prod)=>{
        let newProduct = new Product(prod.id, prod.img, prod.name, prod.price, prod.description, prod.category, prod.stock)
        products.push(newProduct)
    });
    cards()
}
getJSON()

//CARDS
function cards(){
    products.forEach((prod) =>{
        const divProd = document.createElement('div')
        divProd.innerHTML = `
        <div class="card text-center" style="width: 18rem;">
          <img src="${prod.img}" class="card-img-top" alt="Img Product">
           <div class="card-body">
            <h3 class="card-title">${prod.name}</h3>
            <h4 class="card-title">$${prod.price}</h4>
            <p class="card-text">${prod.description}</p>
            <button class="btn btn-primary" id="button${prod.id}">Añadir al carrito</button>
           </div>
        </div>
        `
        productsContainer.append(divProd)
        const button = document.getElementById(`button${prod.id}`);
        button.addEventListener('click', () => {
        addToCart(prod.id);
       });
    })
  }


//CATEGORY
  function filterByCategory(category) {
    let filteredProducts = [];
    
    if (category) {
      filteredProducts = products.filter((prod) => prod.category === category);
    } else {
      filteredProducts = products;
    }
  
    displayFilteredProducts(filteredProducts);
  }
  
  function displayFilteredProducts(filteredProducts) {
    while (productsContainer.firstChild) {
      productsContainer.firstChild.remove();
    }
  
    filteredProducts.forEach((prod) => {
      const divProd = document.createElement('div');
      divProd.innerHTML = `
        <div class="card" style="width: 16rem;">
          <img src="${prod.img}" class="card-img-top" alt="Img Product">
          <div class="card-body">
            <h3 class="card-title">${prod.name}</h3>
            <h4 class="card-title">$${prod.price}</h4>
            <p class="card-text">${prod.description}</p>
            <button class="btn btn-primary" id="button${prod.id}">Añadir al carrito</button>
          </div>
        </div>
      `;
    
      productsContainer.append(divProd);
    
      const button = document.getElementById(`button${prod.id}`);
      button.addEventListener('click', () => {
        addToCart(prod.id);
      });
    });
  }
  filterByCategory('');
  
  //CART
  let cart = []
  const cartContainer = document.getElementById ('cart-container')
  
  //COUNTER
  const counter = document.getElementById ('counter')
  const cartCounter = () =>{
    counter.style.display = 'block'
    counter.innerText = cart.length
  }

  const addToCart = (id) => {
    let productSelected = products.find ((prod)=> prod.id === id)
    let productInCart = cart.find ((prod) => prod.id === id)
    if (productInCart) {
        productInCart.quantity++;
      } else {
        productSelected.quantity = 1;
        cart.push(productSelected);
      }
      showCart()
      showOrder()
      checkCart ()
      cartCounter()
      cartStorage()
  }

 const showCart = () => {
    let showProdCart = '';
    cart.forEach((prod) => {
      showProdCart += `
      <div class="card mb-3" style="max-width: 400px; max-height: 120px">
      <div class="row g-0">
        <div class="col-3">
          <img src="${prod.img}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-9">
          <div class="card-body">
            <h5 class="card-title">${prod.name}</h5>
            <p class="card-text">$${prod.price}</p>
            <p class="card-text">Cantidad: ${prod.quantity}</p>
          </div>
        </div>
      </div>
    </div>
      `;
    });
  
    cartContainer.innerHTML = showProdCart;
    finalTotal();
    checkCart ();
  }


  const deleteProd = (id) => {
   const prodId = parseInt(id); 
   const prod = cart.find((prod) => prod.id === prodId);
   if (prod) {
    cart.splice(cart.indexOf(prod), 1);
    showCart();
    checkCart();
    cartCounter()
    }
  }

  const emptyCart = document.getElementById ('emptyCart')
   emptyCart.addEventListener ('click', ()=>{
   cart.splice(0, cart.length);
   showCart();
   checkCart();
   cartCounter();

})

  const showTotal = document.getElementById ('total')
  const completed = document.getElementById ('completed')

  let total

  const finalTotal = () =>{
   total = 0;
   cart.forEach ((prod)=>{
    total += prod.price * prod.quantity
   })
   showTotal.innerHTML = `Total: $${total}`
  }

  const checkCart = () =>{
    if (cart.length !== 0) {
      completed.disabled = false
    } else {
      completed.disabled = true
    }
  }

  checkCart ()

  ///ORDER
  const order = document.getElementById ('order')
  const showOrder = () =>{
    let divOrder = ''
    cart.forEach ((prod) =>{
      divOrder += `
      <div class= "order">
      <p class= "order-text">${prod.name}</p>
      <p class= "order-text">$${prod.price}</p>
      <p class= "order-text">${prod.quantity}</p>
      </div>
      `
    })

    divOrder += `
    <p class= "order-text-total">Total: $${total}</p>
    `
    order.innerHTML = divOrder
  }

  ////FORM Y BASE DE DATOS DE USUARIOS
  const nameForm = document.getElementById ('name')
  const lastnameForm = document.getElementById ('lastname')
  const addressForm = document.getElementById ('address')
  const emailForm = document.getElementById ('email')
  const final = document.getElementById ('final')

  const userInfo = []

  class NewUser {
    constructor (name, lastname, address, email){
      this.name = name,
      this.lastname = lastname,
      this.address = address,
      this.email = email
    }
  }

  final.addEventListener ('click', ()=>{
    if (nameForm.value === '' || lastnameForm.value === '' || addressForm.value === '' || emailForm.value === ''){
      final.disabled === true,
      alert ('Completa los campos solicitados para continuar')
    } else {
      const user = new NewUser (nameForm.value, lastnameForm.value, addressForm.value, emailForm.value)
      userInfo.push (user)
      cart = []
      showCart()
      cartCounter()
      localStorage.removeItem('cart');
    }
  })

  //STORAGE
  const cartStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  const getCartFromLocalStorage = () => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      cart = JSON.parse(cartData);
      showCart();
      showOrder()
      cartCounter();
    }
  };

  getCartFromLocalStorage();