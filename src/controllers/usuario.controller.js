import { getConnection } from "./../database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./../config.js"; // Archivo donde guardas claves secretas
import crypto from "crypto";
import nodemailer from "nodemailer";

// // Registrar usuario
const registerUser = async (req, res) => {
    try {
        const { nomuser, nombre, apellido, correo, password } = req.body;

        if (!nomuser || !nombre || !apellido || !correo || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const connection = await getConnection();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = { nomuser, nombre, apellido, correo, password: hashedPassword };
        await connection.query("INSERT INTO usuario SET ?", newUser);

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// // Login de usuario
const loginUser = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
        }

        const connection = await getConnection();
        const [user] = await connection.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar el token JWT con la clave secreta desde el archivo .env
        const token = jwt.sign({ idusuario: user.idusuario, correo: user.correo }, config.jwtSecret, {
            expiresIn: "1h", // El token expirará en 1 hora
        });

        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUserQA = async (req, res) => {
    try {
        const { nomuser, nombre, apellido, correo, password } = req.body;

        if (!nomuser || !nombre || !apellido || !correo || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const connection = await getConnection();
        const newUser = { nomuser, nombre, apellido, correo, password };
        await connection.query("INSERT INTO usuario SET ?", newUser);

        res.status(201).json({ message: "Usuario registrado correctamente (QA)" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUserQA = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
        }

        const connection = await getConnection();
        const [user] = await connection.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado (QA)" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Contraseña incorrecta (QA)" });
        }

        res.json({ message: "Login exitoso (QA)", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Endpoint para solicitar restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ message: "El correo es obligatorio" });
        }

        const connection = await getConnection();
        const [user] = await connection.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Generar un token único y una expiración (ejemplo: 1 hora)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora después

        // Guardar el token en la base de datos (puedes usar otra tabla si lo prefieres)
        await connection.query("UPDATE usuario SET reset_token = ?, reset_token_expire = ? WHERE correo = ?", 
            [resetToken, expiresAt, correo]);

        // Enviar el token por email (o devolverlo en la respuesta para pruebas)
        // Configuración básica de Nodemailer (pruebas locales)
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tuemail@gmail.com",
                pass: "tupassword"
            }
        });

        let mailOptions = {
            from: "tuemail@gmail.com",
            to: correo,
            subject: "Restablecimiento de contraseña",
            text: `Usa este token para restablecer tu contraseña: ${resetToken}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Correo enviado con instrucciones", resetToken }); // Solo para pruebas, en producción no devuelvas el token
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const methods = {
    registerUser,
    loginUser,
    registerUserQA,
    loginUserQA
};
