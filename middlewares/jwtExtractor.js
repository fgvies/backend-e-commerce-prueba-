import jwt from "jsonwebtoken";

export const validateJWT = (req, res, next) =>{
  // El token llega así: Bearer SKJDSVOFÑMFMPGFDK MFDDSMP´FDSKMP´FMSDPMFPSDSNSDDSN
// EXTRAER EL HEADER

  const authHeader = req.headers.authorization;
  if(!authHeader) return res.statu(401).send({status:"error", error: "Not Logged"})

  // Si el cliente ya me lo envió, tengo que DESCIFRAR EL TOKEN

  const token = authHeader.split(' ')[1];
  // Pero el token será válido?
  try {
    const userInfo = jwt.verify(token, 'secretjwt');
    req.user = userInfo; // Estamos recreando la funcionalidad de passport con session!
    next();
    
  } catch (error) {
    console.log(error);
    res.status(401).send({status:"error", error: "TOKEN error"})
  }
}