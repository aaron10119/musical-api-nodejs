import {Router} from "express";
import {methods as musicaController} from "./../controllers/musica.controller.js"

const router= Router();

router.get("/", (request, response)=>{
    response.send("Api Musical v1 - 27-02-2025");
});

router.get("/artistas", musicaController.getArtistas);
router.post("/artistas", musicaController.addArtistas);


export default router;