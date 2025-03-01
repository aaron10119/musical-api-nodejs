import { Router } from "express";
import { methods as usuarioController } from "./../controllers/usuario.controller.js";

const router = Router();

router.post("/register", usuarioController.registerUser);
router.post("/login", usuarioController.loginUser);
router.post("/request-reset", usuarioController.requestPasswordReset);
router.post("/reset-password", usuarioController.resetPassword);
router.get("/usuario/:idusuario", usuarioController.getUserProfile); // Obtener datos de usuario
router.post("/usuario/:idusuario/foto", usuarioController.updateProfilePicture); // Actualizar foto de perfil

// Usuarios QA (sin token ni encriptación)
router.post("/qa/register", usuarioController.registerUserQA);
router.post("/qa/login", usuarioController.loginUserQA);


export default router;
