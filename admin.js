// ===============================
// LOGIN ADMIN SEDERHANA
// ===============================
let adminPassword = "12345";

// ===============================
// PROTEKSI ADMIN PAGE
// ===============================
if(sessionStorage.getItem("adminLoggedIn") !== "true"){
  window.location.href = "admin-login.html";
}

// ===============================
// AMBIL SEMUA ORDERS DARI SEMUA USER
// ===============================
let allOrders = [];

for(let key in localStorage){
  if(key.startsWith("orders_")){
    let userOrders = JSON.parse(localStorage.getItem(key));
    userOrders.forEach(order=>{
      order.user = key.replace("orders_","");
      allOrders.push(order);
    });
  }
}

// ===============================
// RENDER ADMIN ORDERS
// ===============================
function renderAdminOrders(){

  const container = document.getElementById("admin-orders");
  container.innerHTML = "";

  if(allOrders.length === 0){
    container.innerHTML = "<p>Tidak ada pesanan.</p>";
    return;
  }

  allOrders.forEach((order,index)=>{

    let itemsHTML = "";
    order.items.forEach(item=>{
      itemsHTML += `<li>${item.name} - Rp ${item.price}</li>`;
    });

    container.innerHTML += `
      <div class="card">
        <h3>${order.id}</h3>
        <p>User: ${order.user}</p>
        <p>Total: Rp ${order.total}</p>
        <p>Status: ${order.status}</p>

        <details>
          <summary>Lihat Detail</summary>
          <ul>${itemsHTML}</ul>
        </details>

        ${order.proof ? `<img src="${order.proof}" style="width:100%; margin-top:10px;">` : ""}

        <br><br>

        <button onclick="updateStatus(${index}, 'Diproses')">Approve</button>
        <button onclick="updateStatus(${index}, 'Dikirim')">Kirim</button>
        <button onclick="updateStatus(${index}, 'Selesai')">Selesai</button>
        <button onclick="deleteOrder(${index})">Hapus</button>

      </div>
    `;
  });

}

renderAdminOrders();

// ===============================
// UPDATE STATUS
// ===============================
function updateStatus(index,newStatus){

  let order = allOrders[index];
  order.status = newStatus;

  let userKey = "orders_" + order.user;
  let userOrders = JSON.parse(localStorage.getItem(userKey));

  userOrders = userOrders.map(o => 
    o.id === order.id ? order : o
  );

  localStorage.setItem(userKey, JSON.stringify(userOrders));

  location.reload();
}

// ===============================
// DELETE ORDER
// ===============================
function deleteOrder(index){

  let order = allOrders[index];
  let userKey = "orders_" + order.user;

  let userOrders = JSON.parse(localStorage.getItem(userKey));
  userOrders = userOrders.filter(o => o.id !== order.id);

  localStorage.setItem(userKey, JSON.stringify(userOrders));

  location.reload();
}

// ===============================
// LOGOUT ADMIN
// ===============================
function logoutAdmin(){
  sessionStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}