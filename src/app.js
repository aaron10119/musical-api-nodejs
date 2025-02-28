import express from 'express';
import morgan from "morgan";
//Routes
import musicaRoutes from "./routes/musica.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

const app = express();

//Settings
app.set("port", 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/api/musica" , musicaRoutes);
app.use("/api/usuarios", usuarioRoutes);


export default app;