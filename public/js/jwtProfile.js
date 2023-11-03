

const token = localStorage.getItem("accessToken");

if (!token) window.location.replace("/login");

// Todo lo pido desde el cliente, así que es mi responsabilidad enviar ese token}

fetch("/api/sessions/profileInfo", {
  method: "GET",
  headers: {
    authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    const user = result.payload;
    const welcome = document.getElementById('welcome');
    const email = document.getElementById('email');
    welcome.innerHTML = `Hola, ${user.name} tu rol es ${user.role}`;
    email.innerHTML = `Correo : ${user.email}`;
  });
