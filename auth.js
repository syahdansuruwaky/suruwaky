// ===============================
// AUTH SYSTEM
// ===============================

// Ambil data
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// ===============================
// PROTEKSI HALAMAN INDEX
// ===============================
if(window.location.pathname.includes("index.html")){
  if(!currentUser){
    window.location.href = "login.html";
  }
}

// ===============================
// CEGAH LOGIN ULANG
// ===============================
if(window.location.pathname.includes("login.html")){
  if(currentUser){
    window.location.href = "index.html";
  }
}

// ===============================
// REGISTER
// ===============================
function register(){
  const username = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;

  if(!username || !password){
    alert("Isi semua data!");
    return;
  }

  if(users.find(u => u.username === username)){
    alert("Username sudah ada!");
    return;
  }

  users.push({username, password});
  localStorage.setItem("users", JSON.stringify(users));

  alert("Berhasil daftar!");
  window.location.href = "login.html";
}

// ===============================
// LOGIN
// ===============================
function login(){
  const username = document.getElementById("logUser").value;
  const password = document.getElementById("logPass").value;

  const user = users.find(u => u.username === username && u.password === password);

  if(!user){
    alert("Login gagal!");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "index.html";
}

// ===============================
// LOGOUT
// ===============================
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// ===============================
// TAMPILKAN USER DI NAVBAR
// ===============================
function checkLoginUI(){
  const info = document.getElementById("user-info");
  if(!info) return;

  if(currentUser){
    info.innerHTML = `
      Halo, ${currentUser.username}
      <button onclick="logout()">Logout</button>
    `;
  }
}

checkLoginUI();