import {config} from "dotenv";

config();

export default {
    jwtSecret: process.env.JWT_SECRET,  // Obtén la clave secreta del archivo .env
    host: process.env.HOST || "",
    database:process.env.DATABASE || "",
    user:process.env.USER || "",
    // password:process.env.PASSWORD
}

