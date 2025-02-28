import { getConnection } from "./../database/database.js";

//Artistas
const getArtistas = async (req, res) =>{
    try{
        const connection = await getConnection();
        const result = await connection.query("SELECT idartista, nombreArtistico, nacimiento, biografia, fotoartista  from artista");
        res.json(result);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const addArtistas = async (req, res) =>{
    try{
        const {nombreArtistico, nacimiento, biografia, fotoartista} = req.body;

        if(nombreArtistico == undefined || nacimiento == undefined || biografia == undefined || fotoartista == undefined){
            res.status(400).json({message:"Bad Request. Please fill all field"});
        }

        const artista = {nombreArtistico, nacimiento, biografia, fotoartista};
        const connection = await getConnection();
        const result=await connection.query("INSERT INTO artista set ?",artista)
        res.json("Artista Añadido");
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};


export const methods = {
    getArtistas, addArtistas
};