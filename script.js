document.addEventListener("DOMContentLoaded", function(){

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if(!currentUser){
    window.location.href = "login.html";
    return;
  }

  // ===============================
  // DATA PRODUK
  // ===============================
  let products = [
    {id:1,name:"Ayam Krispi",price:3500,stock:10,promo:true},
    {id:2,name:"Ayam Jerit",price:3500,stock:8,promo:false},
    {id:3,name:"Burger Daging",price:15000,stock:15,promo:true},
    {id:4,name:"Kentang Goreng",price:8000,stock:20,promo:false}
  ];

  // ===============================
  // CART
  // ===============================
  let cartKey = "cart_" + currentUser.username;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // ===============================
  // ORDERS
  // ===============================
  let orderKey = "orders_" + currentUser.username;
  let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

  // ===============================
  // RENDER PRODUK
  // ===============================
  function renderProducts(){
    const container = document.getElementById("product-list");
    if(!container) return;

    container.innerHTML = "";

    products.forEach((p,index)=>{
      container.innerHTML += `
        <div class="card">
          ${p.promo ? '<span class="badge">Promo</span>' : ''}
          <h3>${p.name}</h3>
          <p>Rp ${p.price}</p>
          <p>Stok: ${p.stock}</p>
          <button onclick="addToCart(${index})">Tambah</button>
        </div>
      `;
    });
  }

  // ===============================
  // TAMBAH KE CART
  // ===============================
  window.addToCart = function(index){
    if(products[index].stock <= 0){
      alert("Stok habis!");
      return;
    }

    products[index].stock--;

    cart.push({
      name: products[index].name,
      price: products[index].price
    });

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCart();
    renderProducts();
  }

  // ===============================
  // UPDATE CART
  // ===============================
  function updateCart(){
    const totalEl = document.getElementById("total");
    let total = 0;

    cart.forEach(item => total += item.price);

    if(totalEl){
      totalEl.textContent = total;
    }
  }

  // ===============================
  // CHECKOUT
  // ===============================
  
  window.checkout = function(){

  if(cart.length === 0){
    alert("Keranjang kosong!");
    return;
  }

  tempTotal = 0;
  cart.forEach(item => tempTotal += item.price);

  document.getElementById("paymentTotal").textContent = tempTotal;
  document.getElementById("paymentModal").style.display = "flex";
}

  // ===============================
  // RENDER ORDERS
  // ===============================
  function renderOrders(){

  const container = document.getElementById("order-history");
  if(!container) return;

  container.innerHTML = "";

  if(orders.length === 0){
    container.innerHTML = "<p>Belum ada pesanan.</p>";
    return;
  }

  orders.forEach((order, index)=>{

    let statusClass = "";

    if(order.status === "Menunggu Verifikasi"){
      statusClass = "status-menunggu";
    }
    else if(order.status === "Diproses"){
      statusClass = "status-proses";
    }
    else if(order.status === "Dikirim"){
      statusClass = "status-kirim";
    }
    else if(order.status === "Selesai"){
      statusClass = "status-selesai";
    }

    let itemsHTML = "";
    order.items.forEach(item=>{
      itemsHTML += `<li>${item.name} - Rp ${item.price}</li>`;
    });

    container.innerHTML += `
      <div class="card">
        <h4>${order.id}</h4>
        <p>Tanggal: ${order.date}</p>
        <p>Status: <span class="${statusClass}">${order.status}</span></p>
        <p>Total: Rp ${order.total}</p>

        <details>
          <summary>Lihat Detail</summary>
          <ul>${itemsHTML}</ul>
        </details>

        ${order.proof ? `<img src="${order.proof}" style="width:100%; margin-top:10px; border-radius:10px;">` : ""}

        ${order.status === "Diproses" ? 
          `<button onclick="cancelOrder(${index})">Batalkan</button>` 
          : ""}

        ${order.status === "Selesai" && !order.rating ? 
          `<button onclick="giveRating(${index})">Beri Rating</button>` 
          : ""}

        ${order.rating ? `<p>⭐ Rating: ${order.rating}/5</p>` : ""}
      </div>
    `;
  });
}


function autoUpdateStatus(){

  orders.forEach(order=>{
    if(order.status === "Diproses"){
      order.status = "Dikirim";
    } else if(order.status === "Dikirim"){
      order.status = "Selesai";
    }
  });

  localStorage.setItem(orderKey, JSON.stringify(orders));
}
window.cancelOrder = function(index){

  if(orders[index].status !== "Diproses"){
    alert("Pesanan tidak bisa dibatalkan.");
    return;
  }

  orders.splice(index,1);
  localStorage.setItem(orderKey, JSON.stringify(orders));

  renderOrders();
}
window.giveRating = function(index){

  let rating = prompt("Beri rating 1 - 5");

  rating = parseInt(rating);

  if(rating >= 1 && rating <= 5){
    orders[index].rating = rating;
    localStorage.setItem(orderKey, JSON.stringify(orders));
    renderOrders();
  } else {
    alert("Rating harus 1 sampai 5");
  }
}
let tempTotal = 0;
window.closePayment = function(){
  document.getElementById("paymentModal").style.display = "none";
}
document.getElementById("paymentMethod").addEventListener("change", function(){

  const info = document.getElementById("paymentInfo");

  if(this.value === "bank"){
    info.innerHTML = "<p>Transfer ke:<br>BCA 1234567890<br>a.n TODANA</p>";
  }
  else if(this.value === "dana"){
    info.innerHTML = "<p>Transfer ke DANA:<br>081234567890</p>";
  }
  else{
    info.innerHTML = "";
  }

});

//PEMBAYARAN
window.confirmPayment = function(){

  const method = document.getElementById("paymentMethod").value;
  const proofInput = document.getElementById("paymentProof");
  const proofFile = proofInput.files[0];

  if(!method){
    alert("Pilih metode pembayaran!");
    return;
  }

  if(!proofFile){
    alert("Upload bukti transfer dulu!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(){

    const newOrder = {
      id: "ORD" + Date.now(),
      date: new Date().toLocaleString(),
      items: cart,
      total: tempTotal,
      status: "Menunggu Verifikasi",
      paymentMethod: method,
      proof: reader.result
    };

    orders.push(newOrder);
    localStorage.setItem(orderKey, JSON.stringify(orders));

    cart = [];
    localStorage.setItem(cartKey, JSON.stringify(cart));

    updateCart();
    renderOrders();

    document.getElementById("paymentModal").style.display = "none";

    alert("Bukti transfer dikirim! Menunggu verifikasi admin.");
  }

  reader.readAsDataURL(proofFile);
}


document.getElementById("paymentProof").addEventListener("change", function(e){

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(){
    const preview = document.getElementById("previewImage");
    preview.src = reader.result;
    preview.style.display = "block";
  }

  if(file){
    reader.readAsDataURL(file);
  }

});
  // ===============================
  // LOAD AWAL
  // ===============================
  renderProducts();
  updateCart();
  renderOrders();
  autoUpdateStatus();

  

});