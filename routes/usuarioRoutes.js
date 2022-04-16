import express from "express";
const router = express.Router();
import {nuevoPassword,perfil,registrar, autenticar, confirmar, olvidePassword, comprobarToken, adashboar} from '../controllers/usuarioController.js';

import checkAuth from '../middleware/checkAuth.js';

// autenticacion, registro y confirmacion de usuarios
router.post('/', registrar)// crea una nuevo usuario
router.post('/login', autenticar)// ahora autenticarlo usuario
router.get("/confirmar/:token", confirmar)//confirmalo por token
router.post("/olvide-password", olvidePassword)// reestablecer passqword
//router.get("/olvide-password/:token", comprobarToken)// permitir cambiar el password
//router.post("/olvide-password/:token", nuevoPassword)// una vez validando el usuario se permitira definir el nuevo password
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get('/perfil',checkAuth, perfil);
//router.get('/perfil',checkAuth, adashboar);


export default router;