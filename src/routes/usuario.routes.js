import { Router } from "express";
import { methods as usuarioController } from "./../controllers/usuario.controller.js";

const router = Router();

router.post("/register", usuarioController.registerUser);
router.post("/login", usuarioController.loginUser);
// Usuarios QA (sin token ni encriptación)
router.post("/qa/register", usuarioController.registerUserQA);
router.post("/qa/login", usuarioController.loginUserQA);


export default router;
