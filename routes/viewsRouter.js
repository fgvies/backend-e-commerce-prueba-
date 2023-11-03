import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  if(!req.session.user){
    return res.redirect('/login')
  }
  res.render("Profile", {user: req.session.user});
});
router.get("/register", async (req, res) => {
  res.render("Register");
});
router.get("/login", async (req, res) => {
  res.render("Login");
});
router.get('/profilejwt', async (req, res)=>{
  res.render('ProfileJWT');
})
export default router;
