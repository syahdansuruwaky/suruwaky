function adminLogin(){

  const username = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  // GANTI SESUAI KEINGINANMU
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "todana123";

  if(username === ADMIN_USER && password === ADMIN_PASS){
    sessionStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin.html";
  } else {
    alert("Username atau password salah!");
  }
}