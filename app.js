import express from "express";
import Handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializeStrategies from "./config/passport.config.js";




const connection = mongoose.connect(
  "mongodb+srv://facundovies:123@cluster0.3geflhe.mongodb.net/PruebaLogin?retryWrites=true&w=majority"
);

const app = express();
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://facundovies:123@cluster0.3geflhe.mongodb.net/PruebaLogin?retryWrites=true&w=majority",
      ttl: 3600,
    }),
    resave: false,
    saveUninitialized: false,
    secret: "papa",
  })
);

initializeStrategies();
app.use(passport.initialize())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.engine("handlebars", Handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const PORT = process.env.PORT || 8080;

app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
