import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'
import UserManager from "../dao/Mongo/managers/UserManager.js";
import auth from "../services/auth.js";
import { validateJWT } from "../middlewares/jwtExtractor.js";


const router = Router();
const userService = new UserManager();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/authFail",
    failureMessage: true,
  }),
  async (req, res) => {
    // No importa la estrategia que estes usando... en el endpoint el usiario siempre va a llegar en req.user.

    res.send({ status: "success", payload: req.user._id });
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/authFail",
    failureMessage: true,
  }),
  async (req, res) => {
    // No importa la estrategia que estes usando... en el endpoint el usiario siempre va a llegar en req.user.
    req.session.user = req.user;
    console.log(req.session.user);
    res.send({ status: "success", message: "Logged in" });
  }
);

router.post("/loginJWT", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

  const user = await userService.getBy({ email });
  console.log(user);

  if (!user) return res.status(400).send({status:"error", error: "Incorrect Credentials"})

  // Ya que existe el usuario, ahora debo comparar las contraseñas
  const isValidPassword = await auth.validatePassword(password, user.password);

  if (!isValidPassword)return res.status(400).send({status:"error", error:"Incorrect Credentials"})
// Si se logueó bien, AHORA LE CREO UN TOKEN
const token = jwt.sign({id:user._id, email: user.email, role:user.role, name:user.firstName}, 
  'secretjwt', 
  {expiresIn:'1h'});
// Si la idea es delgarle el token al usuario, tengo que enviarselo de alguna manera. Puede ser desde el body, desde una cookie, etc.

res.send({status:"success", token});
});


router.get('/profileInfo',validateJWT ,async (req, res)=>{
  // Este deve devolver la información de la peticion a partir del token

res.send({status:"success", payload: req.user})

})
// Para autentificaciones de terceros, siempre ocuparemos dos endpoints
// El primero hará referencia al desencadenante de la estreategia, miestra que el otro tiene que ser el callback
router.get("/github", passport.authenticate("github"), (req, res) => {}); //Trigger de mi estrategia de passport
router.get("/githubcallback", passport.authenticate("github"), (req, res) => {
  // Aquí es donde cae toda la info
  req.session.user = req.user;
  res.redirect("/");
});

router.get("/authFail", (req, res) => {
  // Si cayó en este endpoint, significa que falló.
  if (req.session.messages) {
    res.status(401).send({ status: "Error", error: req.session.messages[0] });
  } else {
    res.status(401).send({
      status: "error",
      error: "Error de input incompleto para estrategia de passport",
    });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      return res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

router.get("/eliminarProductos", async (req, res) => {
  // Primero quiero ver si está logeado
  if (!req.session.user)
    return res
      .status(401)
      .send({ status: "error", message: "No estás logueado" });
  // Llegado a esta linea quiero saber si el usuario tiene permiso para manipular la base de datos.
  if (req.session.user.role !== "admin")
    return res.status(403).send({
      status: "error",
      error: "No tienes permiso para eliminar productos",
    });
  // Si tiene permiso le otorgo el acceso
  return res
    .status(200)
    .send({ status: "Success", message: "Productos eliminados correctamente" });
});

router.get;

export default router;
