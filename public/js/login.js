const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  const response = await fetch("/api/sessions/loginJWT", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  if (response.status === 200) {
    // Descomentar  lo de abajo si usas express sessions 
    // window.location.replace("/");

    // JWT
    localStorage.setItem('accessToken', result.token);
  }
});
