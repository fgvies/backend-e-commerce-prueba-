import { application } from "express";
import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import UserManager from "../dao/Mongo/managers/UserManager.js";
import auth from "../services/auth.js";

const userService = new UserManager();

// Estrategia local = registro y Login
const LocalStrategy = local.Strategy;

const initializeStrategies = () => {
  // Que estrategias tengo instaladas?

  // PASSPORT ODIA CUALQUIER COSA QUE NO SEA USERNAME

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        // Dentro de esta funcion meto la logica de mi registro.
        const { firstName, lastName, age } = req.body;

        if (!lastName || !email || !password)
          return done(null, false, { message: "Incomplete values" });
        // Antes de crear la el usuario, hasheo la contraseña.

        const hashedPassword = await auth.createHash(password);

        const newUser = {
          firstName,
          lastName,
          age,
          email,
          password: hashedPassword,
        };

        const result = await userService.create(newUser);
        // Si todo salió bien... devuelve el user.
        done(null, result);
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        if (!email || !password)
          return done(null, false, { message: "Incomplete Values" });

        const user = await userService.getBy({ email });

        if (!user)
          return done(null, false, { message: "Incorrect credentials" });

        // Ya que existe el usuario, ahora debo comparar las contraseñas
        const isValidPassword = await auth.validatePassword(
          password,
          user.password
        );

        if (!isValidPassword)
          return done(null, user, { message: "Incorrect password" });
        // La magia de done() es devolver al usuario, por lo tanto no puedo usar req.session aquí,
        done(null, user);
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.45858d940454e14d",
        clientSecret: "51813d9b4f4fd2624b963e23f6ef5208f50d8c97",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;
        // Ahora comenzamos a trabajar con nuestra base de datos. Primero verificamos si el email ya existe:

        const user = await userService.getBy({ email });
        if (!user) {
          const newUser = {
            firstName: name,
            email,
            password: ""
          };
          const result = await userService.create(newUser);
          done(null, result);
        } else {
          // Si el usuario ya existia entonces sólo devuélvelo.
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userService.getBy({ _id: id });
    done(null, user);
  });
};

export default initializeStrategies;
